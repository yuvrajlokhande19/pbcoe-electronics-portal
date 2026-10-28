#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Adafruit_Fingerprint.h>
#include <Preferences.h>
#include <ArduinoJson.h>

// ========================================================
// 1. WiFi & Official Supabase Cloud Configuration
// ========================================================
const char* ssid     = "OPPO A53";
const char* password = "00000000";

// Supabase REST Endpoint & Publishable Key
const char* supabaseBaseUrl = "https://vobyuijfocigsbahkvab.supabase.co";
const char* supabaseApiKey  = "sb_publishable_wIYMMvFnNFMXyFavLagzIA_4rBYuOMN";

// Sensor LED Control Fallback Definitions
#ifndef FINGERPRINT_LED_ON
#define FINGERPRINT_LED_ON 0x01
#define FINGERPRINT_LED_OFF 0x02
#define FINGERPRINT_LED_BLUE 0x02
#define FINGERPRINT_LED_RED 0x01
#endif

// ========================================================
// 2. Hardware UART on GPIO 4 (D4) & GPIO 2 (D2) + Buzzer D5
// ========================================================
#define SENSOR_RX 4    // Sensor Yellow (TX) -> ESP32 D4 (GPIO 4)
#define SENSOR_TX 2    // Sensor Green (RX)  -> ESP32 D2 (GPIO 2)
#define BUZZER_PIN 5   // Buzzer (+) -> ESP32 D5 (GPIO 5), Buzzer (-) -> GND

HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
WebServer server(80);
Preferences prefs;

// Buzzer Acoustic Feedback Machine
void playBuzzerTone(int freq, int durationMs) {
  tone(BUZZER_PIN, freq, durationMs);
  delay(durationMs);
  noTone(BUZZER_PIN);
}

// 1. Successful Attendance Check-in: Two crisp high-pitch beeps
void soundCheckInSuccess() {
  playBuzzerTone(2200, 90);
  delay(40);
  playBuzzerTone(2700, 140);
}

// 2. Double Scan (Already Marked Present within 30s): Fast chirp
void soundDoubleScan() {
  playBuzzerTone(2900, 50);
  delay(35);
  playBuzzerTone(3300, 50);
}

// 3. Unrecognized Fingerprint: Soft double-pip alert (no harsh unauth buzzer)
void soundUnrecognized() {
  playBuzzerTone(1800, 60);
  delay(35);
  playBuzzerTone(2200, 75);
}

// 4. Optical Pass Captured: Short confirmation pip
void soundEnrollStep() {
  playBuzzerTone(2400, 70);
}

// ========================================================
// 3. Built-in Roster of 65 PBCOE Candidates (5th Sem ETC)
// ========================================================
struct StudentCandidate {
  uint8_t id;
  const char* prn;
  const char* name;
};

const StudentCandidate ROSTER[65] = {
  { 1, "24121218", "YASH RANJEET INDURKAR" },
  { 2, "24121222", "SAHILKUMAR RUSTAM KHOBRAGADE" },
  { 3, "24121199", "UJWALA TRYAMBAK BHELKAR" },
  { 4, "24121250", "SHRAVANI DEEPAK ATKARI" },
  { 5, "24121236", "POOJA RAJESH UPADHYE" },
  { 6, "24121252", "VEDANT DILIP NANDANWAR" },
  { 7, "24121243", "RITESH PURUSHOTTAM ALONE" },
  { 8, "24121207", "OM PRASHANT CHAUDHARI" },
  { 9, "24121244", "ROHAN JITENDRA SABLE" },
  { 10, "24121219", "ATHARV SANDIP KALE" },
  { 11, "24121198", "SHANTANU DEVANAND BHAGWATKAR" },
  { 12, "24121216", "ROHIT RAJESH GULKARI" },
  { 13, "24121237", "YASHRAJ HIWRAJ RANGARI" },
  { 14, "24121230", "RAJANI NAMDEO MOON" },
  { 15, "24121246", "VRISHABH NARENDRA SAWWALAKHE" },
  { 16, "24121227", "YUVRAJ VILAS LOKHANDE" },
  { 17, "24121215", "SHRUTI NARENDRA GOVINDWAR" },
  { 18, "24121234", "ACHAL ANIL PATLE" },
  { 19, "24121242", "SIDDHI SHYAMUJI RINAIT" },
  { 20, "24121217", "SANCHITA SANJAY GURAV" },
  { 21, "24121204", "SAKSHAM RAJESH BUCHE" },
  { 22, "24121257", "AASTHA PRASHANT WAROTKAR" },
  { 23, "24121231", "JANHAVI RAJESH NAGPURE" },
  { 24, "24121239", "ISHA PRAKASH RAUT" },
  { 25, "24121221", "ARYAN RAVINDRA KHOBRAGADE" },
  { 26, "24121223", "SAMIKSHA KASHINATH KHONDE" },
  { 27, "24121224", "DISHA TRYAMBAK LANDE" },
  { 28, "24121205", "ANUSHKA FAKIRA CHAHANDE" },
  { 29, "24121245", "SARWADNYA AVINASH CHANDEKAR" },
  { 30, "24121258", "YADHNESH VINAYAK DURBUDE" },
  { 31, "24121200", "ATHARVA ABHIJIT BISWAR" },
  { 32, "24121253", "YUGESH CHANDRAPRAKASH VITTHALE" },
  { 33, "24121201", "NANDINI SATISH BODAS" },
  { 34, "24121202", "MAITHELI MAHENDRA BOKDE" },
  { 35, "24121214", "DYANENDRA SUNIL GAURKAR" },
  { 36, "24121226", "LOKESH JAGDISH GAURKAR" },
  { 37, "24121229", "RUCHIKA CHANDRASHEKHAR MESHRAM" },
  { 38, "24121251", "SNEHA PRAMOD KOMBE" },
  { 39, "24121235", "VIPUL VISHAL PATRIWAR" },
  { 40, "24121240", "SALONI BANDU RAUT" },
  { 41, "24121256", "ASHIWINI DHANESHWAR WAGH" },
  { 42, "24121206", "MANTHAN SUNIL CHAKOLE" },
  { 43, "24121228", "MANSI KHUSHAL MESHRAM" },
  { 44, "24121211", "CHHAGAN HIVRAJ DESHMUKH" },
  { 45, "24121209", "SIDDHARTH GAJANAN CHOUDHARY" },
  { 46, "24121210", "VAISHNAVI GAJANAN DAMBHARE" },
  { 47, "24121249", "PRATIK SHUDHODHAN SHENDE" },
  { 48, "24121225", "DAMINI JITENDRA LAROKAR" },
  { 49, "24121197", "SEJAL SUKHDEO BARSAGADE" },
  { 50, "24121233", "ARYAN YOGESH PARMAR" },
  { 51, "24121203", "TUSHAR ISHWAR BOKDE" },
  { 52, "24121254", "ANKIT GAJANAN WADIBHASME" },
  { 53, "24121583", "NAYAN MAROTI BHALSHANKAR" },
  { 54, "24121584", "DIPAK BURDE" },
  { 55, "25122001", "VIKAS SANTOSH PATESHWARI" },
  { 56, "24121247", "JYOTI MUKESH SHARMA" },
  { 57, "25122002", "SRUSHTI RAJU MANKAR" },
  { 58, "25122003", "SUMIT SUPDA LAHASE" },
  { 59, "25122004", "KOMAL BHAGWAT WAGH" },
  { 60, "25122005", "SHRADDHA DHARMRAJ RAJURKAR" },
  { 61, "25122006", "SHRAVANI AMOL RAUT" },
  { 62, "25122007", "AARYAN SATISHSING KACHHAVAH" },
  { 63, "24121212", "SHIVNATH ARUN DESHMUKH" },
  { 64, "24121213", "AAKANKSHA NARESH DHAWANE" },
  { 65, "24121220", "PIYUSH PRADIP KAMDE" }
};

void getStudentInfo(int id, String &name, String &prn) {
  String kn = "n_" + String(id);
  String kr = "r_" + String(id);
  if (prefs.isKey(kn.c_str())) {
    name = prefs.getString(kn.c_str());
    prn = prefs.getString(kr.c_str(), "PRN-" + String(id));
    return;
  }
  for (int i = 0; i < 65; i++) {
    if (ROSTER[i].id == id) {
      name = ROSTER[i].name;
      prn = ROSTER[i].prn;
      return;
    }
  }
  name = "Candidate #" + String(id);
  prn = "PRN-" + String(id);
}

void saveStudent(int id, String name, String roll) {
  String kn = "n_" + String(id);
  String kr = "r_" + String(id);
  prefs.putString(kn.c_str(), name);
  prefs.putString(kr.c_str(), roll);
}

// ========================================================
// 4. State Management & Anti-Duplicate Scan Filter
// ========================================================
enum SystemMode { MODE_ATTENDANCE, MODE_ENROLLING };
SystemMode currentMode = MODE_ATTENDANCE;

int activeCommandId = 0;
int enrollTargetID = 0;
String enrollTargetName = "";
String enrollTargetRoll = "";
String enrollStepMsg = "Idle";
int enrollProgress = 0; // 0: Idle, 1: Pass 1, 2: Lift, 3: Pass 2
unsigned long enrollStartTime = 0;

int lastScannedSlot = -1;
unsigned long lastScannedTime = 0;

void setCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
}

// ========================================================
// 5. Cloud Supabase REST Operations
// ========================================================
void syncAttendanceToSupabase(int id, String name, String roll, String status, int score) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Supabase] WiFi disconnected, skipping attendance log.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  String url = String(supabaseBaseUrl) + "/rest/v1/attendance_logs";
  if (https.begin(client, url)) {
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
    if (httpCode >= 200 && httpCode < 300) {
      Serial.printf("[Supabase] >> Attendance synced successfully! (HTTP %d)\n", httpCode);
    } else {
      Serial.printf("[Supabase] >> Attendance sync failed: HTTP %d - %s\n", httpCode, https.errorToString(httpCode).c_str());
    }
    https.end();
  }
}

void updateCommandStatus(int cmdId, const char* status) {
  if (cmdId <= 0 || WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  String url = String(supabaseBaseUrl) + "/rest/v1/biometric_commands?id=eq." + String(cmdId);
  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");
    https.addHeader("apikey", supabaseApiKey);
    https.addHeader("Authorization", String("Bearer ") + supabaseApiKey);
    https.addHeader("Prefer", "return=minimal");

    String payload = "{\"status\":\"" + String(status) + "\"}";
    int httpCode = https.PATCH(payload);
    Serial.printf("[Command] Updated command #%d status to %s (HTTP %d)\n", cmdId, status, httpCode);
    https.end();
  }
}

void markStudentEnrolledInSupabase(String roll, int slotId) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  String url = String(supabaseBaseUrl) + "/rest/v1/students?prn=eq." + roll;
  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");
    https.addHeader("apikey", supabaseApiKey);
    https.addHeader("Authorization", String("Bearer ") + supabaseApiKey);
    https.addHeader("Prefer", "return=minimal");

    String payload = "{\"enrolled\":true,\"fingerprint_id\":" + String(slotId) + "}";
    int httpCode = https.PATCH(payload);
    Serial.printf("[Supabase] Marked student %s as enrolled in slot #%d (HTTP %d)\n", roll.c_str(), slotId, httpCode);
    https.end();
  }
}

// Poll Supabase for pending enrollment commands
void checkBiometricCommands() {
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck < 350) return;
  lastCheck = millis();

  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient https;

  String url = String(supabaseBaseUrl) + "/rest/v1/biometric_commands?status=eq.PENDING&order=id.asc&limit=1";
  if (https.begin(client, url)) {
    https.addHeader("apikey", supabaseApiKey);
    https.addHeader("Authorization", String("Bearer ") + supabaseApiKey);

    int httpCode = https.GET();
    if (httpCode == 200) {
      String json = https.getString();
      if (json.length() > 5 && json != "[]") {
        JsonDocument doc;
        DeserializationError err = deserializeJson(doc, json);
        if (!err && doc.is<JsonArray>() && doc.as<JsonArray>().size() > 0) {
          JsonObject cmd = doc[0];
          int cmdId = cmd["id"];
          String command = cmd["command"].as<String>();
          int targetId = cmd["target_id"];
          String studentName = cmd["student_name"].as<String>();
          String rollNo = cmd["roll_no"].as<String>();

          if (command == "ENROLL") {
            Serial.println("\n---------------------------------------------------");
            Serial.printf("[COMMAND] Cloud ENROLL request received: Slot #%d\n", targetId);
            Serial.printf("[COMMAND] Student: %s (PRN: %s)\n", studentName.c_str(), rollNo.c_str());
            Serial.println("---------------------------------------------------");

            activeCommandId = cmdId;
            enrollTargetID = targetId;
            enrollTargetName = studentName;
            enrollTargetRoll = rollNo;
            currentMode = MODE_ENROLLING;
            enrollProgress = 1;
            enrollStepMsg = "Step 1: Place finger flat on optical sensor";
            enrollStartTime = millis();

            // Set CONSTANT SOLID BLUE LIGHT on optical sensor prism
            finger.LEDcontrol(FINGERPRINT_LED_ON, 0, FINGERPRINT_LED_BLUE);

            soundEnrollStep();
            updateCommandStatus(cmdId, "STEP_1");
            Serial.println(">> [STEP 1] Optical LED Constant Solid Blue Active! Place finger on sensor glass now...");
          }
          
          // DELETE command: remove fingerprint template from R307 flash & ESP32 storage
          else if (command == "DELETE") {
            Serial.println("\n---------------------------------------------------");
            Serial.printf("[COMMAND] Cloud DELETE request: Slot #%d (%s)\n", targetId, studentName.c_str());
            Serial.println("---------------------------------------------------");
            if (targetId >= 1 && targetId <= 127) {
              uint8_t delResult = finger.deleteModel(targetId);
              String kn = "n_" + String(targetId);
              String kr = "r_" + String(targetId);
              prefs.remove(kn.c_str());
              prefs.remove(kr.c_str());
              updateCommandStatus(cmdId, "DELETED");
              if (delResult == FINGERPRINT_OK) {
                soundCheckInSuccess();
                Serial.printf(">> [DELETE] Slot #%d successfully erased from R307 flash!\n", targetId);
              } else {
                soundUnrecognized();
                Serial.printf(">> [DELETE] Slot #%d was empty or removed (code: %d)\n", targetId, delResult);
              }
            } else {
              updateCommandStatus(cmdId, "DELETED");
              Serial.println(">> [DELETE] Invalid slot ID — skipped.");
            }
          }
          else {
            Serial.printf("[COMMAND] Ignored unknown command #%d: %s\n", cmdId, command.c_str());
            updateCommandStatus(cmdId, "IGNORED");
          }
        }
      }
    }
    https.end();
  }
}

// ========================================================
// 6. Two-Pass Fingerprint Enrollment Machine
// ========================================================
void processEnrollment() {
  static unsigned long lastSensorPoll = 0;
  if (millis() - lastSensorPoll < 80) return; // 80ms UART pacing maintains constant steady blue LED without flickering
  lastSensorPoll = millis();

  // Check for 60-second timeout
  if (millis() - enrollStartTime > 60000) {
    Serial.println(">> [ENROLL] Registration timed out (60s). Returning to attendance mode.");
    finger.LEDcontrol(FINGERPRINT_LED_OFF, 0, FINGERPRINT_LED_BLUE);
    soundUnrecognized();
    updateCommandStatus(activeCommandId, "FAILED");
    currentMode = MODE_ATTENDANCE;
    enrollProgress = 0;
    activeCommandId = 0;
    return;
  }

  // PASS 1: Capture First Image
  if (enrollProgress == 1) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      Serial.println(">> [ENROLL] Image 1 captured! Converting to template...");
      p = finger.image2Tz(1);
      if (p == FINGERPRINT_OK) {
        soundEnrollStep();
        Serial.println(">> [STEP 2] Template 1 generated successfully! Lift finger now...");
        enrollStepMsg = "Image 1 OK! Lift finger...";
        enrollProgress = 2;
        updateCommandStatus(activeCommandId, "LIFT_FINGER");
      }
    }
  } 
  // STEP 2: Wait until user lifts finger
  else if (enrollProgress == 2) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_NOFINGER) {
      soundEnrollStep();
      Serial.println(">> [STEP 3] Finger lifted. Place SAME finger again (Pass 2 of 2)...");
      enrollStepMsg = "Place SAME finger again (Pass 2)...";
      enrollProgress = 3;
      updateCommandStatus(activeCommandId, "PASS_2");
    }
  } 
  // PASS 2: Capture Second Image & Store Template
  else if (enrollProgress == 3) {
    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      Serial.println(">> [ENROLL] Image 2 captured! Converting to template...");
      p = finger.image2Tz(2);
      if (p == FINGERPRINT_OK) {
        Serial.println(">> [ENROLL] Creating unified biometric model...");
        p = finger.createModel();
        if (p == FINGERPRINT_OK) {
          Serial.printf(">> [ENROLL] Storing model into sensor flash slot #%d...\n", enrollTargetID);
          p = finger.storeModel(enrollTargetID);
          if (p == FINGERPRINT_OK) {
            saveStudent(enrollTargetID, enrollTargetName, enrollTargetRoll);
            markStudentEnrolledInSupabase(enrollTargetRoll, enrollTargetID);
            updateCommandStatus(activeCommandId, "SUCCESS");

            // Turn off LED after successful enrollment
            finger.LEDcontrol(FINGERPRINT_LED_OFF, 0, FINGERPRINT_LED_BLUE);

            // Double celebration chime
            soundCheckInSuccess();
            delay(120);
            soundCheckInSuccess();

            Serial.println("===================================================");
            Serial.printf(">> [SUCCESS] Successfully enrolled slot #%d for %s!\n", enrollTargetID, enrollTargetName.c_str());
            Serial.println("===================================================\n");

            delay(1500);
            currentMode = MODE_ATTENDANCE;
            enrollProgress = 0;
            activeCommandId = 0;
          } else {
            finger.LEDcontrol(FINGERPRINT_LED_OFF, 0, FINGERPRINT_LED_BLUE);
            soundUnrecognized();
            updateCommandStatus(activeCommandId, "FAILED");
            currentMode = MODE_ATTENDANCE;
            enrollProgress = 0;
            activeCommandId = 0;
          }
        } else {
          finger.LEDcontrol(FINGERPRINT_LED_OFF, 0, FINGERPRINT_LED_BLUE);
          soundUnrecognized();
          updateCommandStatus(activeCommandId, "FAILED");
          currentMode = MODE_ATTENDANCE;
          enrollProgress = 0;
          activeCommandId = 0;
        }
      }
    }
  }
}

// ========================================================
// 7. Attendance Scanning Loop with Buzzer Audio Patterns
// ========================================================
void processAttendance() {
  static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 180) {
    lastCheck = millis();

    uint8_t p = finger.getImage();
    if (p == FINGERPRINT_OK) {
      p = finger.image2Tz();
      if (p == FINGERPRINT_OK) {
        p = finger.fingerSearch();
        if (p == FINGERPRINT_OK) {
          int id = finger.fingerID;
          String name, roll;
          getStudentInfo(id, name, roll);

          // Check if double scan within 30 seconds
          if (id == lastScannedSlot && (millis() - lastScannedTime < 30000)) {
            Serial.printf(">> [DOUBLE SCAN] Slot #%d (%s) already attended!\n", id, name.c_str());
            soundDoubleScan();
          } else {
            Serial.println("\n---------------------------------------------------");
            Serial.printf(">> [MATCH] Slot #%d | %s | PRN: %s (Score: %d)\n", id, name.c_str(), roll.c_str(), finger.confidence);
            Serial.println("---------------------------------------------------");

            soundCheckInSuccess();
            lastScannedSlot = id;
            lastScannedTime = millis();
            syncAttendanceToSupabase(id, name, roll, "Present", finger.confidence);
          }
        } else if (p == FINGERPRINT_NOTFOUND) {
          Serial.println("\n>> [UNKNOWN] Unregistered fingerprint detected on optical prism.");
          soundUnrecognized();
          syncAttendanceToSupabase(0, "Unregistered Student", "N/A", "Unregistered", 0);
        }
      }

      // Wait until finger is removed so single touch doesn't double-trigger
      while (finger.getImage() != FINGERPRINT_NOFINGER) {
        server.handleClient();
        delay(30);
      }
    }
  }
}

// Handle manual Serial commands from Arduino Serial Monitor
void handleSerialCommands() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd.startsWith("ENROLL")) {
      int spaceIdx = cmd.indexOf(' ');
      if (spaceIdx > 0) {
        int targetSlot = cmd.substring(spaceIdx + 1).toInt();
        if (targetSlot >= 1 && targetSlot <= 127) {
          String sName, sRoll;
          getStudentInfo(targetSlot, sName, sRoll);
          activeCommandId = 0;
          enrollTargetID = targetSlot;
          enrollTargetName = sName;
          enrollTargetRoll = sRoll;
          currentMode = MODE_ENROLLING;
          enrollProgress = 1;
          enrollStartTime = millis();
          finger.LEDcontrol(FINGERPRINT_LED_ON, 0, FINGERPRINT_LED_BLUE);
          soundEnrollStep();
          Serial.printf("\n[SERIAL] Manual enrollment triggered for Slot #%d (%s)\n", targetSlot, sName.c_str());
          Serial.println(">> Optical Blue Light Constant ON! Place finger on sensor glass now (Pass 1 of 2)...");
        }
      }
    } else if (cmd.startsWith("DELETE")) {
      int spaceIdx = cmd.indexOf(' ');
      if (spaceIdx > 0) {
        int targetSlot = cmd.substring(spaceIdx + 1).toInt();
        if (targetSlot >= 1 && targetSlot <= 127) {
          uint8_t p = finger.deleteModel(targetSlot);
          String kn = "n_" + String(targetSlot);
          String kr = "r_" + String(targetSlot);
          prefs.remove(kn.c_str());
          prefs.remove(kr.c_str());
          if (p == FINGERPRINT_OK) {
            Serial.printf(">> [SERIAL] Deleted template at Slot #%d successfully!\n", targetSlot);
            soundCheckInSuccess();
          } else {
            Serial.printf(">> [SERIAL] Slot #%d was empty or could not be deleted (code: %d)\n", targetSlot, p);
            soundUnrecognized();
          }
        }
      }
    } else if (cmd == "CLEARALL" || cmd == "EMPTY") {
      finger.emptyDatabase();
      prefs.clear();
      Serial.println(">> [SERIAL] All templates in R307 flash database CLEARED!");
      soundCheckInSuccess();
    } else if (cmd == "LIST") {
      finger.getTemplateCount();
      Serial.printf("R307 Template Count: %d\n", finger.templateCount);
    } else if (cmd == "BEEP") {
      soundCheckInSuccess();
    } else if (cmd == "HELP") {
      Serial.println("Commands: ENROLL <id> | DELETE <id> | CLEARALL | LIST | BEEP | HELP");
    }
  }
}

// ========================================================
// 8. Setup & Main Routine
// ========================================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Power-on chirp melody
  playBuzzerTone(2000, 70);
  delay(30);
  playBuzzerTone(2500, 90);

  prefs.begin("students", false);

  Serial.println("\n=======================================================");
  Serial.println("  PBCOE Biometric Node v2026 (Pure Cloud Supabase)     ");
  Serial.println("  Department of Electronics & Telecommunication (ETC)  ");
  Serial.println("  Hardware: ESP32 + R307 + D5 Buzzer + Cloud Sync      ");
  Serial.println("=======================================================");

  // Connect to WiFi
  Serial.printf("[WiFi] Connecting to %s...\n", ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 40) {
    delay(400);
    Serial.print(".");
    wifiAttempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[WiFi] Connected! Node IP: http://%s\n", WiFi.localIP().toString().c_str());
    Serial.printf("[Supabase] Connected to: %s\n", supabaseBaseUrl);
    playBuzzerTone(2800, 60);
  } else {
    Serial.println("\n[WiFi] Failed to connect! Node will continue offline polling.");
  }

  // R307 UART on D4 (RX) & D2 (TX) at 57600
  mySerial.begin(57600, SERIAL_8N1, SENSOR_RX, SENSOR_TX);
  delay(300);

  if (finger.verifyPassword()) {
    Serial.println("[OK] R307 Optical Fingerprint Sensor Handshake Successful!");
    finger.getTemplateCount();
    Serial.printf("[Sensor] Stored Biometric Templates in Flash: %d\n", finger.templateCount);
  } else {
    Serial.println("[FAIL] R307 Sensor not responding on GPIO 4 / GPIO 2!");
    Serial.println("[FAIL] Check wiring: Yellow->D4, Green->D2, Red->VIN(5V), Black->GND");
  }

  // Diagnostic Local Web Server
  server.on("/", []() {
    setCorsHeaders();
    String h = "<h1>PBCOE Biometric Node v2026 Active</h1>";
    h += "<p>Department: Electronics & Telecommunication (ETC)</p>";
    h += "<p>HOD: Dr. Pravin B. Pokle</p>";
    h += "<p>Connected to Supabase Cloud: " + String(supabaseBaseUrl) + "</p>";
    h += "<p>Enrolled Templates: " + String(finger.templateCount) + "</p>";
    server.send(200, "text/html", h);
  });

  server.on("/enroll", []() {
    setCorsHeaders();
    if (server.hasArg("id")) {
      int tid = server.arg("id").toInt();
      String sName, sRoll;
      getStudentInfo(tid, sName, sRoll);
      if (server.hasArg("name")) sName = server.arg("name");
      if (server.hasArg("roll")) sRoll = server.arg("roll");

      activeCommandId = 0;
      enrollTargetID = tid;
      enrollTargetName = sName;
      enrollTargetRoll = sRoll;
      currentMode = MODE_ENROLLING;
      enrollProgress = 1;
      enrollStartTime = millis();
      finger.LEDcontrol(FINGERPRINT_LED_ON, 0, FINGERPRINT_LED_BLUE);
      soundEnrollStep();

      server.send(200, "application/json", "{\"status\":\"ENROLL_STARTED\",\"slot\":" + String(tid) + "}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Missing id parameter\"}");
    }
  });

  server.begin();
  Serial.println("[System] Biometric Attendance System Ready with D5 Buzzer. Place finger to test...\n");
}

void loop() {
  server.handleClient();
  handleSerialCommands();

  if (currentMode == MODE_ENROLLING) {
    processEnrollment();
  } else {
    processAttendance();
    checkBiometricCommands();
  }
}
