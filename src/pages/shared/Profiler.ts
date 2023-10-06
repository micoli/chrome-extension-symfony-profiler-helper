const profilerTabs = [
  ["cache", "Cache"],
  ["config", "Config"],
  ["db", "Database"],
  ["dump", "Dump"],
  ["events", "Events"],
  ["exception", "Exception"],
  ["form", "Form"],
  ["http_client", "Http Client"],
  ["logger", "Logger"],
  ["mailer", "Mailer"],
  ["mercure", "Mercure"],
  ["messenger", "Messenger"],
  ["request", "Request"],
  ["router", "Router"],
  ["security", "Security"],
  ["serializer", "Serializer"],
  ["time", "Time"],
  ["translation", "Translation"],
  ["twig", "Twig"],
  ["validator", "Validator"],
];

const profilerMetrics: [string, string, string, number | null][] = [
  ["db", "Database", "metrics", null],
  ["cache", "Cache", "metrics", 8],
  ["events", "Events", "tabs", null],
  ["messenger", "Messenger", "tabs", null],
  ["router", "Router", "metrics", null],
  ["time", "Performance", "metrics", null],
];

export { profilerTabs, profilerMetrics };
