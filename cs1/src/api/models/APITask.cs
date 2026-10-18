public record class APITaskRecord(
    string Title = "",
    DateTime Deadline = default,
    int Priority = 0
);