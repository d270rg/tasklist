using Microsoft.EntityFrameworkCore;

public class NotesService(ApplicationDbContext context)
{
    public async Task<List<TaskRecord>> GetPage(Pagination pagination)
    {
        IQueryable<TaskRecord> query = context.Tasks;

        if (pagination.Filter is not null)
        {

            var predicate = PredicateSpinner<TaskRecord>.Unwrap(pagination.Filter);
            query = query.Where(predicate);
        }

        if (pagination.Sort is not null)
        {
            query = pagination.Sort.Field switch
            {
                "Title" => query.OrderBy(t => t.Title),
                "Deadline" => query.OrderBy(t => t.Deadline),
                "Priority" => query.OrderBy(t => t.Priority),
                "ID" or _ => query.OrderBy(t => t.ID)
            };
        }

        query = query.Skip(pagination.Start);

        if (pagination.Limit != -1)
        {
            query = query.Take(pagination.Limit);
        }

        return await query.ToListAsync();
    }
    public async Task<TaskRecord?> GetById(Guid id)
    {
        return await context.Tasks.FindAsync(id);
    }

    public async Task<Guid> Add(TaskRecord taskRecord)
    {
        var created = context.Tasks.Add(taskRecord);
        await context.SaveChangesAsync();
        return (Guid)created.Entity.ID!;
    }

    public async Task<bool> Delete(Guid id)
    {
        var deleted = await context.Tasks.Where(task => task.ID == id).ExecuteDeleteAsync();
        await context.SaveChangesAsync();
        return deleted > 0;
    }
}