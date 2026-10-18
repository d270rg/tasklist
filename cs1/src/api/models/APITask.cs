using FluentValidation;

public class APITaskRecordValidator : AbstractValidator<APITaskRecord>
{
    public APITaskRecordValidator()
    {
        RuleFor(x => x.Deadline).NotEmpty().WithMessage("Deadline is required");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Title should not be empty");
        RuleFor(x => x.Priority).GreaterThanOrEqualTo(0).WithMessage("Priority should be non-negative integer");
    }
}


public record class APITaskRecord(
    DateTime? Deadline,
    string? Title,
    int Priority = 0
);