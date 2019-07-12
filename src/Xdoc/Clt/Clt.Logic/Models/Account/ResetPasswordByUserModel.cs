using System.ComponentModel.DataAnnotations;

namespace Clt.Logic.Models.Account
{
    public class ResetPasswordByUserModel : ResetPasswordByAdminModel
    {

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        //[Compare("Password", ErrorMessage = "Пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }
}
