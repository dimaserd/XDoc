using System;
using System.ComponentModel.DataAnnotations;

namespace Doc.Contract.Models
{
    public class DemoDocumentModel
    {
        /// <summary>
        /// Имя
        /// </summary>
        [Display(Name = "Имя")]
        [Required(ErrorMessage = "Необходимо указать имя")]
        public string Name { get; set; }

        /// <summary>
        /// Фамилия
        /// </summary>
        [Display(Name = "Фамилия")]
        [Required(ErrorMessage = "Необходимо указать фамилию")]
        public string LastName { get; set; }

        /// <summary>
        /// Отчество
        /// </summary>
        [Display(Name = "Отчество")]
        [Required(ErrorMessage = "Необходимо указать отчество")]
        public string Patronymic { get; set; }

        /// <summary>
        /// Дата начала отпуска
        /// </summary>
        [Display(Name = "Дата начала отпуска")]
        [Required(ErrorMessage = "Необходимо указать дату начала отпуска")]
        public DateTime FromDate { get; set; }

        /// <summary>
        /// Дата окончания отпуска
        /// </summary>
        [Display(Name = "Дата окончания отпуска")]
        [Required(ErrorMessage = "Необходимо указать дату окончания дату окончания отпуска")]
        public DateTime ToDate { get; set; }
    }
}