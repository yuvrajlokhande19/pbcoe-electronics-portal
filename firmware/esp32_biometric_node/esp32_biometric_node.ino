#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Adafruit_Fingerprint.h>
#include <Preferences.h>

// ==========================================
// 1. WiFi & Firebase Configuration
// ==========================================
const char* ssid     = "bittu";
const char* password = "YOUR_PASSWORD";

// Firebase Realtime Database URL
const char* firebaseUrl = "https://my-project-1-602b7-default-rtdb.firebaseio.com";

// ==========================================
// 2. Hardware UART on GPIO 4 (D4) & GPIO 2 (D2)
// ==========================================
#define SENSOR_RX 4  // Sensor Yellow (TX) -> ESP32 D4 (GPIO 4)
#define SENSOR_TX 2  // Sensor Green (RX)  -> ESP32 D2 (GPIO 2)

HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
WebServer server(80);
Preferences prefs;

// ==========================================
// 3. State Management & In-Memory Logs
// ==========================================
enum SystemMode { MODE_ATTENDANCE, MODE_ENROLLING };
SystemMode currentMode = MODE_ATTENDANCE;

int enrollTargetID = 0;
String enrollTargetName = "";
String enrollTargetRoll = "";
String enrollStepMsg = "Idle";
int enrollProgress = 0; // 0: Idle, 1: 1st pass, 2: Lift, 3: 2nd pass

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

// Student persistent metadata
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

// ==========================================
// 4. Firebase Sync Service
// ==========================================
void syncWithFirebase(int id, String name, String roll, String status, int score) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // Bypass SSL cert validation
  HTTPClient https;

  // 1. Post to attendance_logs
  String logEndpoint = String(firebaseUrl) + "/attendance_logs.json";
  if (https.begin(client, logEndpoint)) {
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

  // 2. Put to live_scan for instant broadcast
  String liveEndpoint = String(firebaseUrl) + "/live_scan.json";
  if (https.begin(client, liveEndpoint)) {
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

// ==========================================
// 5. REST API & Web Dashboard
// ==========================================
void handleTelemetry() {
  setCorsHeaders();
  finger.getTemplateCount();
  String json = "{";
  json += "\"status\":\"Online\",";
  json += "\"mode\":\"" + String(currentMode == MODE_ENROLLING ? "ENROLLING" : "ATTENDANCE") + "\",";
  json += "\"templates\":" + String(finger.templateCount) + ",";
  json += "\"enroll_msg\":\"" + enrollStepMsg + "\",";
  json += "\"enroll_target\":\"#" + String(enrollTargetID) + " " + enrollTargetName + "\",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"last_event\":\"" + lastEvent + "\",";
  json += "\"records\":[";
  for (int i = 0; i < logCount; i++) {
    json += "{\"id\":" + String(logs[i].id) + ",";
    json += "\"name\":\"" + logs[i].name + "\",";
    json += "\"roll\":\"" + logs[i].roll + "\",";
    json += "\"status\":\"" + logs[i].status + "\",";
    json += "\"score\":" + String(logs[i].score) + ",";
    json += "\"time\":" + String(logs[i].timeSec) + "}";
    if (i < logCount - 1) json += ",";
  }
  json += "]}";
  server.send(200, "application/json", json);
}

void handleStartEnroll() {
  setCorsHeaders();
  if (!server.hasArg("id") || !server.hasArg("name") || !server.hasArg("roll")) {
    server.send(400, "application/json", "{\"ok\":false,\"msg\":\"Missing required fields\"}");
    return;
  }

  enrollTargetID = server.arg("id").toInt();
  enrollTargetName = server.arg("name");
  enrollTargetRoll = server.arg("roll");

  if (enrollTargetID < 1 || enrollTargetID > 127) {
    server.send(400, "application/json", "{\"ok\":false,\"msg\":\"ID must be 1 to 127\"}");
    return;
  }

  currentMode = MODE_ENROLLING;
  enrollProgress = 1;
  enrollStepMsg = "Place finger on sensor (Pass 1 of 2)...";
  server.send(200, "application/json", "{\"ok\":true}");
}

void handleCancelEnroll() {
  setCorsHeaders();
  currentMode = MODE_ATTENDANCE;
  enrollProgress = 0;
  enrollStepMsg = "Cancelled.";
  server.send(200, "application/json", "{\"ok\":true}");
}

// Built-in minimalist status page
void handleRoot() {
  setCorsHeaders();
  String html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>PBCOE Node</title>";
  html += "<style>body{background:#090d16;color:#f8fafc;font-family:sans-serif;padding:2rem;text-align:center;}";
  html += "h1{color:#38bdf8;}a{color:#38bdf8;text-decoration:none;font-weight:bold;}</style></head><body>";
  html += "<h1>PBCOE Biometric Node Active</h1>";
  html += "<p>IP: " + WiFi.localIP().toString() + " | Templates: " + String(finger.templateCount) + "</p>";
  html += "<p><a href='/api/telemetry'>View Live JSON Telemetry</a></p>";
  html += "<p style='color:#94a3b8;'>Connected to PBCOE Portal with Firebase Telemetry.</p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// ==========================================
// 6. Enrollment Logic (2-Pass Verification)
// ==========================================
void processEnrollment() {
  if (enrollProgress == 1) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      p = finger.image2Tz(1);
      if (p == FINGERPRINT_OK) {
        enrollStepMsg = "Image 1 captured! Lift finger now...";
        enrollProgress = 2;
      } else {
        enrollStepMsg = "Image unclear. Place finger firmly...";
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
            enrollStepMsg = "SUCCESS: Enrolled #" + String(enrollTargetID) + " (" + enrollTargetName + ")";
            delay(2000);
            currentMode = MODE_ATTENDANCE;
            enrollProgress = 0;
          } else {
            enrollStepMsg = "Flash storage error.";
            currentMode = MODE_ATTENDANCE;
          }
        } else {
          enrollStepMsg = "Prints did not match. Please retry.";
          currentMode = MODE_ATTENDANCE;
        }
      }
    }
  }
}

// ==========================================
// 7. Attendance Loop
// ==========================================
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
          syncWithFirebase(id, name, roll, "Present", finger.confidence);
        } else if (p == FINGERPRINT_NOTFOUND) {
          lastEvent = "Unregistered Finger Scan";
          Serial.println(">> [UNKNOWN] Unregistered fingerprint scanned.");
          addAttendanceLog(0, "Unregistered Student", "N/A", "Unregistered", 0);
          syncWithFirebase(0, "Unregistered Student", "N/A", "Unregistered", 0);
        }
      }

      while (finger.getImage() != FINGERPRINT_NOFINGER) {
        server.handleClient();
        delay(40);
      }
    }
  }
}

// ==========================================
// 8. Setup & Loop
// ==========================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  prefs.begin("students", false);

  Serial.println("\n--- PBCOE Biometric Node ---");
  Serial.printf("[WiFi] Connecting to %s...\n", ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }

  Serial.printf("\n[WiFi] Connected! IP: http://%s\n", WiFi.localIP().toString().c_str());

  // R307 on D4 (RX) & D2 (TX)
  mySerial.begin(57600, SERIAL_8N1, SENSOR_RX, SENSOR_TX);
  delay(300);

  if (finger.verifyPassword()) {
    Serial.println("[OK] R307 Handshake Successful!");
  } else {
    Serial.println("[FAIL] R307 not responding on D4/D2.");
  }

  server.on("/", handleRoot);
  server.on("/api/telemetry", handleTelemetry);
  server.on("/api/start-enroll", handleStartEnroll);
  server.on("/api/cancel-enroll", handleCancelEnroll);
  server.begin();
  Serial.println("[Web] Server running with CORS support.");
}

void loop() {
  server.handleClient();

  if (currentMode == MODE_ENROLLING) {
    processEnrollment();
  } else {
    processAttendance();
  }
}
