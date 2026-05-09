package com.healthapp.doctor_booking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ZoomService {

    private static final Logger log = LoggerFactory.getLogger(ZoomService.class);

    @Value("${ZOOM_CLIENT_ID}")
    private String clientId;

    @Value("${ZOOM_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${ZOOM_ACCOUNT_ID}")
    private String accountId;

    private final WebClient webClient = WebClient.create();

    public Map<String, String> createMeeting(String topic, String startTime) {
        String accessToken = "";

        try {
            // STEP 1: Get OAuth Access Token
            log.info("Requesting Zoom Access Token for Account ID: {}", accountId);
            String tokenUrl = "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + accountId;

            Map<String, Object> tokenResponse = webClient.post()
                    .uri(tokenUrl)
                    .headers(h -> h.setBasicAuth(clientId, clientSecret))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            accessToken = (String) tokenResponse.get("access_token");
            log.info("Successfully obtained Zoom Access Token.");

        } catch (WebClientResponseException e) {
            log.error("STEP 1 FAILED: Could not get token. Check your Client ID/Secret. Zoom Response: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Zoom Auth Failed");
        }

        try {
            // STEP 2: Create the Meeting
            log.info("Creating Zoom meeting for topic: {} at {}", topic, startTime);
            Map<String, Object> meetingRequest = new HashMap<>();
            meetingRequest.put("topic", topic);
            meetingRequest.put("type", 2); 
            meetingRequest.put("start_time", startTime); 
            meetingRequest.put("duration", 30);
            meetingRequest.put("timezone", "Asia/Kolkata");
            
            Map<String, Object> settings = new HashMap<>();
            settings.put("join_before_host", true);
            settings.put("jbh_time", 0);
            meetingRequest.put("settings", settings);

            Map<String, Object> meetingResponse = webClient.post()
                    .uri("https://api.zoom.us/v2/users/me/meetings")
                    .header("Authorization", "Bearer " + accessToken)
                    .bodyValue(meetingRequest)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            log.info("Successfully created Zoom meeting.");

            // STEP 3: Return the URLs
            Map<String, String> meetingLinks = new HashMap<>();
            meetingLinks.put("join_url", (String) meetingResponse.get("join_url"));
            meetingLinks.put("start_url", (String) meetingResponse.get("start_url"));
            
            return meetingLinks;

        } catch (WebClientResponseException e) {
            log.error("STEP 2 FAILED: Meeting API rejected the request. Check your 'Scopes' in Zoom Portal. Zoom Response: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Zoom Meeting Creation Failed");
        }
    }
}