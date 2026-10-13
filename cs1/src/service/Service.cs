using LinqKit;
using Microsoft.EntityFrameworkCore;

public class NotesService(ApplicationDbContext context)
{
    public async Task<List<TaskRecord>> GetPage(Pagination pagination)
    {
        var query = context.Tasks.Skip(0);
        if (pagination.Filter is not null)
        {
            var predicate = PredicateBuilder.New<TaskRecord>();
            PredicateSpinner<TaskRecord>.Unwrap(ref predicate, pagination.Filter);
            query = query.Where(predicate);
        }

        query = query.Skip(pagination.Start).Take(pagination.Limit);

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

        return await query.ToListAsync();
    }
    public async Task<TaskRecord?> GetById(string id)
    {
        return await context.Tasks.FindAsync(id);
    }

    public async Task Add(TaskRecord task)
    {
        await context.Tasks.AddAsync(task);
    }

    public async Task Delete(string id)
    {
        await context.Tasks.Where(task => task.ID == id).ExecuteDeleteAsync();
    }
}