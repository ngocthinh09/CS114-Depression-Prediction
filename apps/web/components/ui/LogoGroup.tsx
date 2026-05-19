import Image from "next/image";
import Link from "next/link";

export const LogoGroup = () => {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0 group">
      <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-white/50 transition-all group-hover:shadow-md">
        <img
          alt="UIT Logo"
          className="h-8 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcYvsUGIH8-7rfwmzdbe9pNTzumYgmecHIT26cooHtqjCdlFYwTuf8OCh7gZZS1ABtdGAjv2uFvoJ2D434tD9i52DHzLolaggcO4bPTgCusNypEbya0Yeh6cXCpfczNRUVo7kkTSXrjnMiYp4B_reQ32xRQyO2WdAKaT1Oqfwp_jxWMlzzTyT6NpUFiyXpQ3umSn_okoJGAF9vFHHdK6uu9BjLNgFlIeoKNWZl9FGH8s4f7vhl2d3_dUwo9YsafCUvYDmBYrW0Ug"
        />
        <div className="w-px h-6 bg-outline-variant/30" />
        <img
          alt="CS Logo"
          className="h-8 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTJpLzEZYYc1YotlkNjQeGzsnHPdqvZtFoPvp0NwySYaRmfulJt0u9jQNp_OqlfiR_rMzLMhH1MTWjknRRvI4bEMK2-ujDh26oFiThCfCP4g_GT2nwXubdwdTgbdKUQU0P0p4j0dqEU21BrddsYOqZlhzcoDIguBkxumXjDmtMPRXQuFlrW3eK0RqVivVcrFI2Sqj5tOKO8zHTBr_LMvj_icK9F1XUtGD4gyU_QcT8VLmv4pTAERWptgOhbPhWHzVNrSa6jGqJ5A"
        />
      </div>
      <span className="text-headline-md font-bold text-primary tracking-tight">
        MindfulCheck
      </span>
    </Link>
  );
};
