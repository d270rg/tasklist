using FluentValidation;

public record class APITaskRecord(
    DateTime? Deadline,
    string? Title,
    int Priority = 0
);

public class APITaskRecordValidator : AbstractValidator<APITaskRecord>
{
    public APITaskRecordValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title should not be empty");
        RuleFor(x => x.Priority).GreaterThanOrEqualTo(0).WithMessage("Priority should be non-negative integer");
    }
}

public record class APITaskRecordUpdate(
    DateTime? Deadline,
    string? Title,
    int? Priority
);

public class APITaskRecordUpdateValidator : AbstractValidator<APITaskRecordUpdate>
{
    public APITaskRecordUpdateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().When(x => x.Title is not null).WithMessage("Title should not be empty string");
        RuleFor(x => x.Priority).GreaterThanOrEqualTo(0).When(x => x.Priority != null).WithMessage("Priority should be non-negative integer");
    }
}
