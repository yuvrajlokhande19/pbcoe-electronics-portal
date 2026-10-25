#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Adafruit_Fingerprint.h>
#include <Preferences.h>

// ========================================================
// 1. WiFi & Firebase Configuration (Direct Internet Cloud)
// ========================================================
const char* ssid     = "bittu";
const char* password = "YOUR_PASSWORD";

// Firebase Realtime Database URL
const char* firebaseUrl = "https://my-project-1-602b7-default-rtdb.firebaseio.com";

// ========================================================
// 2. Hardware UART on GPIO 4 (D4) & GPIO 2 (D2)
// ========================================================
#define SENSOR_RX 4  // Sensor Yellow (TX) -> ESP32 D4 (GPIO 4)
#define SENSOR_TX 2  // Sensor Green (RX)  -> ESP32 D2 (GPIO 2)

HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
WebServer server(80);
Preferences prefs;

// State Tracking
enum SystemMode { MODE_ATTENDANCE, MODE_ENROLLING };
SystemMode currentMode = MODE_ATTENDANCE;

int enrollTargetID = 0;
String enrollTargetName = "";
String enrollTargetRoll = "";
String enrollStepMsg = "Idle";
int enrollProgress = 0; // 0: Idle, 1: 1st pass, 2: Lift, 3: 2nd pass
unsigned long lastCommandCheck = 0;

struct AttendanceLog {
  int id;
  String name;
  String roll;
  String status;
  int score;
  unsigned long timeSec;
};

#define MAX_LOGS 40
AttendanceLog logs[MAX_LOGS];
int logCount = 0;
String lastEvent = "Ready. Place finger on sensor...";

void setCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

void addAttendanceLog(int id, String name, String roll, String status, int score) {
  if (logCount < MAX_LOGS) {
    logs[logCount] = {id, name, roll, status, score, millis() / 1000};
    logCount++;
  } else {
    for (int i = 0; i < MAX_LOGS - 1; i++) {
      logs[i] = logs[i + 1];
    }
    logs[MAX_LOGS - 1] = {id, name, roll, status, score, millis() / 1000};
  }
}

// Student Flash Storage Helpers
String getStudentName(int id) {
  String key = "n_" + String(id);
  return prefs.getString(key.c_str(), "Student #" + String(id));
}

String getStudentRoll(int id) {
  String key = "r_" + String(id);
  return prefs.getString(key.c_str(), "PRN-" + String(id));
}

void saveStudent(int id, String name, String roll) {
  String kn = "n_" + String(id);
  String kr = "r_" + String(id);
  prefs.putString(kn.c_str(), name);
  prefs.putString(kr.c_str(), roll);
}

// ========================================================
// 3. Direct Firebase Cloud Sync Services
// ========================================================
void syncAttendanceToFirebase(int id, String name, String roll, String status, int score) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // SSL cert bypass
  HTTPClient https;

  // 1. Post to permanent log history
  String logUrl = String(firebaseUrl) + "/attendance_logs.json";
  if (https.begin(client, logUrl)) {
    https.addHeader("Content-Type", "application/json");
    String payload = "{";
    payload += "\"fingerID\":" + String(id) + ",";
    payload += "\"name\":\"" + name + "\",";
    payload += "\"roll\":\"" + roll + "\",";
    payload += "\"status\":\"" + status + "\",";
    payload += "\"confidence\":" + String(score) + ",";
    payload += "\"timestamp\":{\".sv\":\"timestamp\"}";
    payload += "}";
    https.POST(payload);
    https.end();
  }

  // 2. Broadcast live scan event for instant toast on all devices
  String liveUrl = String(firebaseUrl) + "/live_scan.json";
  if (https.begin(client, liveUrl)) {
    https.addHeader("Content-Type", "application/json");
    String payload = "{";
    payload += "\"fingerID\":" + String(id) + ",";
    payload += "\"name\":\"" + name + "\",";
    payload += "\"roll\":\"" + roll + "\",";
    payload += "\"status\":\"" + status + "\",";
    payload += "\"confidence\":" + String(score) + ",";
    payload += "\"timestamp\":{\".sv\":\"timestamp\"}";
    payload += "}";
    https.PUT(payload);
    https.end();
  }
}

void updateCloudEnrollStatus(String step, int progress, String message) {
  if (WiFi.status() != WL_CONNECTED) return;
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  String url = String(firebaseUrl) + "/biometric_node/status.json";
  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");
    String payload = "{";
    payload += "\"step\":\"" + step + "\",";
    payload += "\"progress\":" + String(progress) + ",";
    payload += "\"message\":\"" + message + "\",";
    payload += "\"timestamp\":{\".sv\":\"timestamp\"}";
    payload += "}";
    https.PUT(payload);
    https.end();
  }
}

// Check if website submitted an enrollment request via Firebase
void checkCloudEnrollCommands() {
  if (WiFi.status() != WL_CONNECTED || currentMode == MODE_ENROLLING) return;
  if (millis() - lastCommandCheck < 3000) return;
  lastCommandCheck = millis();

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  String url = String(firebaseUrl) + "/biometric_node/command.json";
  if (https.begin(client, url)) {
    int httpCode = https.GET();
    if (httpCode == 200) {
      String res = https.getString();
      if (res.indexOf("\"status\":\"PENDING\"") > 0) {
        // Parse ID
        int idIdx = res.indexOf("\"target_id\":");
        if (idIdx > 0) {
          int idEnd = res.indexOf(",", idIdx);
          int targetId = res.substring(idIdx + 12, idEnd).toInt();
          if (targetId >= 1 && targetId <= 127) {
            enrollTargetID = targetId;
            enrollTargetName = "Candidate #" + String(targetId);
            enrollTargetRoll = String(targetId);
            currentMode = MODE_ENROLLING;
            enrollProgress = 1;
            enrollStepMsg = "Place finger on sensor (Pass 1 of 2)...";
            Serial.printf("[Cloud Command] Starting enrollment for slot #%d\n", targetId);
            updateCloudEnrollStatus("PASS_1", 25, "Place finger on sensor prism");

            // Mark command as active
            https.end();
            if (https.begin(client, url)) {
              https.addHeader("Content-Type", "application/json");
              https.PATCH("{\"status\":\"PROCESSING\"}");
            }
          }
        }
      }
    }
    https.end();
  }
}

// ========================================================
// 4. Two-Pass Fingerprint Enrollment State Machine
// ========================================================
void processEnrollment() {
  if (enrollProgress == 1) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      p = finger.image2Tz(1);
      if (p == FINGERPRINT_OK) {
        enrollStepMsg = "Image 1 captured! Lift finger now...";
        updateCloudEnrollStatus("LIFT_FINGER", 50, "Image 1 OK! Lift finger");
        enrollProgress = 2;
      }
    }
  } 
  else if (enrollProgress == 2) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) {
      enrollStepMsg = "Place SAME finger again (Pass 2 of 2)...";
      updateCloudEnrollStatus("PASS_2", 75, "Place same finger again");
      enrollProgress = 3;
    }
  } 
  else if (enrollProgress == 3) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      p = finger.image2Tz(2);
      if (p == FINGERPRINT_OK) {
        p = finger.createModel();
        if (p == FINGERPRINT_OK) {
          p = finger.storeModel(enrollTargetID);
          if (p == FINGERPRINT_OK) {
            saveStudent(enrollTargetID, enrollTargetName, enrollTargetRoll);
            enrollStepMsg = "SUCCESS: Enrolled #" + String(enrollTargetID);
            updateCloudEnrollStatus("COMPLETED", 100, "Successfully enrolled in memory");
            delay(1500);
            currentMode = MODE_ATTENDANCE;
            enrollProgress = 0;
          } else {
            updateCloudEnrollStatus("ERROR", 0, "Flash storage error");
            currentMode = MODE_ATTENDANCE;
          }
        } else {
          updateCloudEnrollStatus("MISMATCH", 0, "Prints did not match. Retry");
          currentMode = MODE_ATTENDANCE;
        }
      }
    }
  }
}

// ========================================================
// 5. Attendance Scanning Loop
// ========================================================
void processAttendance() {
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 250) {
    lastCheck = millis();

    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      p = finger.image2Tz();
      if (p == FINGERPRINT_OK) {
        p = finger.fingerSearch();
        if (p == FINGERPRINT_OK) {
          int id = finger.fingerID;
          String name = getStudentName(id);
          String roll = getStudentRoll(id);
          lastEvent = "Match: " + name + " (#" + String(id) + ")";
          Serial.printf(">> [MATCH] #%d | %s | %s (Score: %d)\n", id, name.c_str(), roll.c_str(), finger.confidence);
          
          addAttendanceLog(id, name, roll, "Present", finger.confidence);
          syncAttendanceToFirebase(id, name, roll, "Present", finger.confidence);
        } else if (p == FINGERPRINT_NOTFOUND) {
          lastEvent = "Unregistered Finger Scan";
          Serial.println(">> [UNKNOWN] Unregistered fingerprint detected.");
          addAttendanceLog(0, "Unregistered Student", "N/A", "Unregistered", 0);
          syncAttendanceToFirebase(0, "Unregistered Student", "N/A", "Unregistered", 0);
        }
      }

      while (finger.getImage() != FINGERPRINT_NOFINGER) {
        server.handleClient();
        delay(40);
      }
    }
  }
}

// ========================================================
// 6. Setup & Main Routine
// ========================================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  prefs.begin("students", false);

  Serial.println("\n=======================================================");
  Serial.println("  PBCOE Biometric Node v2026 (Pure Cloud Internet)     ");
  Serial.println("=======================================================");

  // Connect to WiFi
  Serial.printf("[WiFi] Connecting to %s...\n", ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }

  Serial.printf("\n[WiFi] Connected! IP: %s\n", WiFi.localIP().toString().c_str());
  Serial.printf("[Firebase] Streaming to: %s\n", firebaseUrl);

  // R307 UART on D4 (RX) & D2 (TX) at 57600
  mySerial.begin(57600, SERIAL_8N1, SENSOR_RX, SENSOR_TX);
  delay(300);

  if (finger.verifyPassword()) {
    Serial.println("[OK] R307 Handshake Successful!");
  } else {
    Serial.println("[FAIL] R307 not responding on D4/D2.");
  }

  // Minimalist Local Diagnostic Web Server
  server.on("/", []() {
    setCorsHeaders();
    String h = "<h1>PBCOE Biometric Node Active (Cloud Sync)</h1>";
    h += "<p>Connected to Firebase Realtime Database: " + String(firebaseUrl) + "</p>";
    server.send(200, "text/html", h);
  });
  server.begin();
}

void loop() {
  server.handleClient();

  if (currentMode == MODE_ENROLLING) {
    processEnrollment();
  } else {
    processAttendance();
    checkCloudEnrollCommands();
  }
}
