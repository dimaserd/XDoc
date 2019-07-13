namespace Clt.Contract.Models.Account
{
    public class ChangeUserPasswordModel
    {
        public string OldPassword { get; set; }

        public string NewPassword { get; set; }
    }
}
