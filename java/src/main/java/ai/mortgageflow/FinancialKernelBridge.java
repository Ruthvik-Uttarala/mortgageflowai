package ai.mortgageflow;

public final class FinancialKernelBridge {
    static {
        System.loadLibrary("mortgageflow_kernel");
    }

    private FinancialKernelBridge() {
    }

    public static native byte[] serializeRateLock(int loanId, short lockDays, int rateBasisPoints);

    public static native RateLockRecord deserializeRateLock(byte[] payload);

    public record RateLockRecord(int loanId, short lockDays, int rateBasisPoints) {
    }
}
