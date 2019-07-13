using Croco.Core.Search;

namespace Xdoc.Extensions
{
    public class PagerModel
    {
        public static PagerModel ToPagerModel<T>(GetListResult<T> model, string linkFormat) where T : class
        {
            return new PagerModel
            {
                CurrentPage = model.GetCurrentPageNumber(),
                LinkFormat = linkFormat,
                PagesCount = model.GetPagesCount(),
                PageSize = model.Count.Value,
            };
        }

        public int PagesCount { get; set; }

        public int CurrentPage { get; set; }

        public int PageSize { get; set; }

        public string LinkFormat { get; set; }
    }
}
