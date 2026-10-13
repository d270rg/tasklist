public class TaskRecord
{
    public string ID { get; }

    public string Title = "";

    public DateTime Deadline;

    public int Priority;

    public TaskRecord()
    {
        ID = Guid.NewGuid().ToString();
    }

    public TaskRecord(TaskRecord task)
    {
        ID = task.ID;

        Title = task.Title;

        Deadline = task.Deadline;

        Priority = task.Priority;
    }
}