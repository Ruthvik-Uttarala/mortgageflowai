# Java JNI Stub

This folder shows how a Java service could call a native C++ financial kernel in a production mortgage system.

Build outline:

```bash
javac -h java/native java/src/main/java/ai/mortgageflow/FinancialKernelBridge.java
```

Then implement the generated JNI header in C++ and link it with the deterministic serialization logic in `systems/financial_kernel.cpp`.

Production notes:

- Keep native buffers bounded and validate payload sizes.
- Convert byte order explicitly at the native boundary.
- Treat JNI exceptions as part of the API contract.
- Run native code under the same audit and release process as Java services.
