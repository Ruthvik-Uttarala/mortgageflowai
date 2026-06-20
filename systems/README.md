# Systems Financial Kernel

`financial_kernel.cpp` demonstrates deterministic serialization for a small rate lock record.

It uses:

- fixed-width integer types
- bounded `std::vector<uint8_t>` buffers
- `std::optional` for parse failure instead of unsafe null pointer assumptions
- network byte order with `htonl`, `htons`, `ntohl`, and `ntohs`

Build example on Linux/macOS:

```bash
c++ -std=c++17 systems/financial_kernel.cpp -o systems/financial_kernel
./systems/financial_kernel
```

On Windows, use a compiler environment that provides Winsock byte-order functions or adapt the byte-order calls through a small platform wrapper.
