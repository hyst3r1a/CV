package com.mike.orbitcv.service;

import java.net.URI;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

final class ContentSanitizer {

    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\p{Cntrl}&&[^\r\n\t]]");
    private static final Pattern COLOR = Pattern.compile("^#[0-9a-fA-F]{6}$");
    private static final Set<String> TIMELINE_TYPES = Set.of("JOB", "ACHIEVEMENT", "AWARD");

    private ContentSanitizer() {
    }

    static String text(String value, int maxLength) {
        if (value == null) return "";
        String clean = CONTROL_CHARS.matcher(value).replaceAll("")
                .replace("<", "")
                .replace(">", "")
                .trim();
        return clean.length() <= maxLength ? clean : clean.substring(0, maxLength).trim();
    }

    static String nullableUrl(String value) {
        String clean = text(value, 500);
        if (clean.isBlank()) return null;

        try {
            URI uri = URI.create(clean);
            String scheme = uri.getScheme();
            if (scheme == null) return null;
            String normalized = scheme.toLowerCase();
            return normalized.equals("http") || normalized.equals("https") ? clean : null;
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    static String color(String value) {
        String clean = text(value, 16);
        return COLOR.matcher(clean).matches() ? clean : "#22d3ee";
    }

    static String timelineType(String value) {
        String clean = text(value, 32).toUpperCase();
        return TIMELINE_TYPES.contains(clean) ? clean : "JOB";
    }

    static int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    static String techStack(List<String> values) {
        if (values == null) return "";
        return values.stream()
                .map((value) -> text(value, 64))
                .filter((value) -> !value.isBlank())
                .limit(12)
                .reduce((left, right) -> left + ", " + right)
                .orElse("");
    }
}
