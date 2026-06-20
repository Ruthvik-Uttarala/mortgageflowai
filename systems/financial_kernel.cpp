#include <arpa/inet.h>
#include <cstdint>
#include <cstring>
#include <iomanip>
#include <iostream>
#include <optional>
#include <stdexcept>
#include <vector>

struct RateLockRecord {
  uint32_t loan_id;
  uint16_t lock_days;
  uint32_t rate_basis_points;
};

std::vector<uint8_t> serialize_rate_lock(const RateLockRecord& record) {
  std::vector<uint8_t> bytes(sizeof(uint32_t) + sizeof(uint16_t) + sizeof(uint32_t));
  uint32_t loan_id = htonl(record.loan_id);
  uint16_t lock_days = htons(record.lock_days);
  uint32_t rate = htonl(record.rate_basis_points);

  std::memcpy(bytes.data(), &loan_id, sizeof(loan_id));
  std::memcpy(bytes.data() + sizeof(loan_id), &lock_days, sizeof(lock_days));
  std::memcpy(bytes.data() + sizeof(loan_id) + sizeof(lock_days), &rate, sizeof(rate));
  return bytes;
}

std::optional<RateLockRecord> deserialize_rate_lock(const std::vector<uint8_t>& bytes) {
  if (bytes.size() != sizeof(uint32_t) + sizeof(uint16_t) + sizeof(uint32_t)) {
    return std::nullopt;
  }

  uint32_t loan_id;
  uint16_t lock_days;
  uint32_t rate;
  std::memcpy(&loan_id, bytes.data(), sizeof(loan_id));
  std::memcpy(&lock_days, bytes.data() + sizeof(loan_id), sizeof(lock_days));
  std::memcpy(&rate, bytes.data() + sizeof(loan_id) + sizeof(lock_days), sizeof(rate));

  return RateLockRecord{ntohl(loan_id), ntohs(lock_days), ntohl(rate)};
}

int main() {
  RateLockRecord record{1042001, 45, 6875};
  std::vector<uint8_t> bytes = serialize_rate_lock(record);
  std::optional<RateLockRecord> parsed = deserialize_rate_lock(bytes);

  if (!parsed) {
    throw std::runtime_error("Failed to deserialize rate lock record");
  }

  const RateLockRecord& value = *parsed;
  std::cout << "loan_id=" << value.loan_id << " lock_days=" << value.lock_days
            << " rate=" << std::fixed << std::setprecision(3)
            << static_cast<double>(value.rate_basis_points) / 1000.0 << "%\n";
  return 0;
}
