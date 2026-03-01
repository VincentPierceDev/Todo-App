namespace NetTestProject
{
    public record TodoResponseDto(
        int id,
        string name,
        bool isComplete
    );

    public record TodoCreateRequestDto(
        string name,
        bool isComplete
    );

    public record TodoPatchRequestDto(
        bool? isComplete
    );
}
