using System.ComponentModel.DataAnnotations.Schema;

public record class TaskRecord(
    Guid? ID,
    string Title,
    DateTime? Deadline,

    [property: DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    DateTime? CreatedAt,

    [property: DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    DateTime? UpdatedAt,

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
            CreatedAt: null,
            UpdatedAt: null,
            Priority: apiTaskRecord.Priority);
    }
}
