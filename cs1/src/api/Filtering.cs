using System.Linq.Expressions;
using System.Runtime.InteropServices;
using LinqKit;

public record SortOptions
{
    public required string Field;
    public required string Direction;
}

public record FilterOptions
{
    public required string Field;

    public required string Op;

    public required object Value;
}

public record Pagination
{
    public readonly FilterGroup? Filter;

    public readonly SortOptions? Sort;

    public readonly int Start = 0;

    public readonly int Limit = -1;

    public readonly int Size = -1;
}

public record FilterNode
{
    public readonly FilterGroup? Group;
    public readonly FilterOptions? Options;
}

public record FilterGroup
{
    public readonly Dictionary<string, FilterNode> Terms = [];
}

static class PredicateSpinner<Entity> where Entity : class
{
    public static ExpressionStarter<Entity> Unwrap(FilterGroup filterGroup, [Optional] ExpressionStarter<Entity> predicate)
    {
        var newPredicate = predicate ?? PredicateBuilder.New<Entity>();
        foreach (var term in filterGroup.Terms)
        {
            newPredicate = UnwrapTerm(term, predicate ?? PredicateBuilder.New<Entity>());
        }

        return newPredicate;
    }

    private static ExpressionStarter<Entity> UnwrapTerm(KeyValuePair<string, FilterNode> term, ExpressionStarter<Entity> predicate)
    {
        if (term.Value.Group is not null && term.Value.Options is not null)
        {
            throw new InvalidCastException("Operator value should be either FilterGroup or FilterOptions, it can't be both");
        }

        if (term.Value.Group is not null)
        {
            return Unwrap(term.Value.Group, predicate);
        }
        else
            if (term.Value.Options is not null)
            {
                return ProccessOptionsLeaf(term, predicate);
            }
            else
            {
                throw new InvalidCastException("Invalid operator value, value of operator should be FilterGroup or FilterOptions");
            }
    }

    private static ExpressionStarter<Entity> ProccessOptionsLeaf(KeyValuePair<string, FilterNode> term, ExpressionStarter<Entity> predicate)
    {
        var field = typeof(Entity).GetProperty(term.Value.Options!.Field)
                   ?? throw new ArgumentException($"Property '{term.Value.Options.Field}' not found.");

        var entity = Expression.Parameter(typeof(Entity));

        var value = Expression.Constant(
            Convert.ChangeType(term.Value.Options.Value, field.PropertyType),
            field.PropertyType);

        var entityField = Expression.Property(entity, field);

        var convertedValue = Expression.Convert(value, field.PropertyType);

        var eqLambda = Expression.Lambda<Func<Entity, bool>>(
                        Expression.Equal(
                            entityField,
                            convertedValue),
                        entity);

        var gtLambda = Expression.Lambda<Func<Entity, bool>>(
                        Expression.GreaterThan(
                            entityField,
                            convertedValue),
                        entity);

        var ltLambda = Expression.Lambda<Func<Entity, bool>>(
                        Expression.LessThan(
                            entityField,
                            convertedValue),
                        entity);

        var gteLambda = Expression.Lambda<Func<Entity, bool>>(
                        Expression.GreaterThanOrEqual(
                            entityField,
                            convertedValue),
                        entity);

        var lteLambda = Expression.Lambda<Func<Entity, bool>>(
                        Expression.LessThanOrEqual(
                            entityField,
                            convertedValue),
                        entity);



        var newPredicate = term.Key.ToLower() switch
        {
            "and" => (ExpressionStarter<Entity>)(term.Value.Options.Op.ToLower() switch
            {
                "eq" => predicate.And(eqLambda),
                "gt" => predicate.And(gtLambda),
                "lt" => predicate.And(ltLambda),
                "gte" => predicate.And(gteLambda),
                "lte" => predicate.And(lteLambda),
                _ => throw new InvalidCastException("Unsupported operation"),
            }),
            "or" => (ExpressionStarter<Entity>)(term.Value.Options.Op.ToLower() switch
            {
                "eq" => predicate.And(eqLambda),
                "gt" => predicate.And(gtLambda),
                "lt" => predicate.And(ltLambda),
                "gte" => predicate.And(gteLambda),
                "lte" => predicate.And(lteLambda),
                _ => throw new InvalidCastException("Unsupported operation"),
            }),
            _ => throw new InvalidCastException("Invalid operator key, operator key should be `AND` or `OR` in any case"),
        };

        return newPredicate;
    }
}
