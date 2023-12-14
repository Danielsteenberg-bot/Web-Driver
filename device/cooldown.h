#ifndef COOLDOWN
#define COOLDOWN(cooldown_time, code) \
do { \
  static unsigned long _last_execution_time = 0; \
  unsigned long _current_time = millis(); \
  if (_current_time - _last_execution_time >= cooldown_time || _current_time < _last_execution_time) { \
    _last_execution_time = _current_time; \
    code \
  } \
} while (0)
#endif