using System;
using System.Collections.Generic;
using System.Linq;

namespace Zoo.Doc.Declension.Logic
{
    public class GetFunctionNameAndArgs
    {
        public GetFunctionNameAndArgs(string match)
        {
            FunctionName = match.Substring(2, match.IndexOf('(') - 2);

            Args = GetStringBetween(match, "(", ")").Split(new[] { "," },
                options: StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim()).ToList();
        }

        public string FunctionName { get; }

        public List<string> Args { get; }

        public static string GetStringBetween(string s, string from, string to)
        {
            var pFrom = s.IndexOf(from) + from.Length;
            var pTo = s.IndexOf(to);

            return s.Substring(pFrom, pTo - pFrom);
        }
    }
}
