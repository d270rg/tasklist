public record class TaskRecord(
    Guid? ID,
    string Title,
    DateTime? Deadline,
    int Priority
);

static class TransformTaskRecord
{
    public static TaskRecord ToDomain(this APITaskRecord apiTaskRecord)
    {
        // Trust me
        return new(
            ID: null,
            Title: apiTaskRecord.Title!,
            Deadline: apiTaskRecord.Deadline!.Value,
            Priority: apiTaskRecord.Priority);
    }
}
