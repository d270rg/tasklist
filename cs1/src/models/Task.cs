public class TaskRecord
{
    public string ID { get; init; } = Guid.NewGuid().ToString();

    public string Title { get; init; } = "";

    public DateTime Deadline { get; init; }

    public int Priority { get; init; }
}