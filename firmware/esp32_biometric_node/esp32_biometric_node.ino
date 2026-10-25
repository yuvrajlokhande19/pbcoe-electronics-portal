#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Adafruit_Fingerprint.h>
#include <Preferences.h>

// ========================================================
// 1. WiFi & Official Supabase Cloud Configuration
// ========================================================
const char* ssid     = "bittu";
const char* password = "YOUR_PASSWORD";

// Supabase REST Endpoint & Publishable Key
const char* supabaseUrl = "https://vobyuijfocigsbahkvab.supabase.co/rest/v1/attendance_logs";
const char* supabaseApiKey = "sb_publishable_wIYMMvFnNFMXyFavLagzIA_4rBYuOMN";

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
int enrollProgress = 0;

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
// 3. Direct Supabase Cloud REST Sync
// ========================================================
void syncAttendanceToSupabase(int id, String name, String roll, String status, int score) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // SSL cert bypass
  HTTPClient https;

  if (https.begin(client, supabaseUrl)) {
    https.addHeader("Content-Type", "application/json");
    https.addHeader("apikey", supabaseApiKey);
    https.addHeader("Authorization", String("Bearer ") + supabaseApiKey);
    https.addHeader("Prefer", "return=minimal");

    String payload = "{";
    payload += "\"fingerprint_id\":" + String(id) + ",";
    payload += "\"prn\":\"" + roll + "\",";
    payload += "\"student_name\":\"" + name + "\",";
    payload += "\"status\":\"" + status + "\",";
    payload += "\"confidence\":" + String(score);
    payload += "}";

    int httpCode = https.POST(payload);
    if (httpCode > 0) {
      Serial.printf("[Supabase] Successfully posted log! HTTP Code: %d\n", httpCode);
    } else {
      Serial.printf("[Supabase] Post failed: %s\n", https.errorToString(httpCode).c_str());
    }
    https.end();
  }
}

// ========================================================
// 4. Two-Pass Fingerprint Enrollment Machine
// ========================================================
void processEnrollment() {
  if (enrollProgress == 1) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      p = finger.image2Tz(1);
      if (p == FINGERPRINT_OK) {
        enrollStepMsg = "Image 1 captured! Lift finger now...";
        enrollProgress = 2;
      }
    }
  } 
  else if (enrollProgress == 2) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) {
      enrollStepMsg = "Place SAME finger again (Pass 2 of 2)...";
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
            delay(1500);
            currentMode = MODE_ATTENDANCE;
            enrollProgress = 0;
          } else {
            currentMode = MODE_ATTENDANCE;
          }
        } else {
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
          syncAttendanceToSupabase(id, name, roll, "Present", finger.confidence);
        } else if (p == FINGERPRINT_NOTFOUND) {
          lastEvent = "Unregistered Finger Scan";
          Serial.println(">> [UNKNOWN] Unregistered fingerprint detected.");
          addAttendanceLog(0, "Unregistered Student", "N/A", "Unregistered", 0);
          syncAttendanceToSupabase(0, "Unregistered Student", "N/A", "Unregistered", 0);
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
  Serial.println("  PBCOE Biometric Node v2026 (Direct Supabase Cloud)   ");
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
  Serial.printf("[Supabase] Endpoint: %s\n", supabaseUrl);

  // R307 UART on D4 (RX) & D2 (TX) at 57600
  mySerial.begin(57600, SERIAL_8N1, SENSOR_RX, SENSOR_TX);
  delay(300);

  if (finger.verifyPassword()) {
    Serial.println("[OK] R307 Handshake Successful!");
  } else {
    Serial.println("[FAIL] R307 not responding on D4/D2.");
  }

  // Diagnostic Local Web Server
  server.on("/", []() {
    setCorsHeaders();
    String h = "<h1>PBCOE Biometric Node Active (Supabase Cloud Sync)</h1>";
    h += "<p>Connected to Supabase: " + String(supabaseUrl) + "</p>";
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
  }
}
