using System.ComponentModel.DataAnnotations;

namespace Zoo.Doc.Declension.Enumerations
{
    /// <summary>
    /// Падеж слова
    /// </summary>
    public enum WordCase
    {
        /// <summary>
        /// Именительный падеж
        /// </summary>
        [Display(Name = "Именительный падеж")]
        И,

        /// <summary>
        /// Родительный падеж
        /// </summary>
        [Display(Name = "Родительный падеж")]
        Р,

        /// <summary>
        /// Дательный падеж
        /// </summary>
        [Display(Name = "Дательный падеж")]
        Д,

        /// <summary>
        /// Винительный падеж
        /// </summary>
        [Display(Name = "Винительный падеж")]
        В,

        /// <summary>
        /// Творительный падеж
        /// </summary>
        [Display(Name = "Именительный падеж")]
        Т,

        /// <summary>
        /// Предложный падеж
        /// </summary>
        [Display(Name = "Предложный падеж")]
        П
    }
}