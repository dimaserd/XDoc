using System;
using Zoo.Doc.Declension.Enumerations;

namespace Zoo.Doc.Declension.Models
{
    public class Declension
    {
        //<Р>Сердюкова Дмитрия Александровича</Р>
        //<Д>Сердюкову Дмитрию Александровичу</Д>
        //<В>Сердюкова Дмитрия Александровича</В>
        //<Т>Сердюковым Дмитрием Александровичем</Т>
        //<П>Сердюкове Дмитрии Александровиче</П>

        /// <summary>
        /// Именительный падеж
        /// </summary>
        public string И { get; set; }

        /// <summary>
        /// Родительный падеж
        /// </summary>
        public string Р { get; set; }

        /// <summary>
        /// Дательный падеж
        /// </summary>
        public string Д { get; set; }

        /// <summary>
        /// Винительный падеж
        /// </summary>
        public string В { get; set; }

        /// <summary>
        /// Творительный
        /// </summary>
        public string Т { get; set; }

        /// <summary>
        /// Предложный падеж
        /// </summary>
        public string П { get; set; }


        public string GetByWordCase(WordCase wordCase)
        {
            return wordCase switch
            {
                WordCase.И => И,
                WordCase.Р => Р,
                WordCase.Д => Д,
                WordCase.В => В,
                WordCase.Т => Т,
                WordCase.П => П,
                _ => throw new ArgumentOutOfRangeException(nameof(wordCase), wordCase, null),
            };
        }
    }
}
