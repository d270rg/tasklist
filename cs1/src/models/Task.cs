public record class TaskRecord(
    Guid? ID,
    string Title = "",
    DateTime Deadline = default,
    int Priority = 0
);

static class TransformTaskRecord
{
    public static TaskRecord ToDomain(this APITaskRecord apiTaskRecord)
    {
        return new(
            ID: null,
            Title: apiTaskRecord.Title,
            Deadline: apiTaskRecord.Deadline,
            Priority: apiTaskRecord.Priority);
    }
}
