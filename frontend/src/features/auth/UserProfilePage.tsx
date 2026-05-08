import { Link } from "react-router-dom";
import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { readAuthUser, updateAuthUser } from "../../utils/auth";

const hometownOptions = [
   "An Giang",
   "Bac Ninh",
   "Ca Mau",
   "Can Tho",
   "Cao Bang",
   "Da Nang",
   "Dak Lak",
   "Dien Bien",
   "Dong Nai",
   "Dong Thap",
   "Gia Lai",
   "Ha Noi",
   "Ha Tinh",
   "Hai Phong",
   "Hung Yen",
   "Khanh Hoa",
   "Lai Chau",
   "Lam Dong",
   "Lang Son",
   "Lao Cai",
   "Nghe An",
   "Ninh Binh",
   "Phu Tho",
   "Quang Ngai",
   "Quang Ninh",
   "Quang Tri",
   "Soc Trang",
   "Son La",
   "Tay Ninh",
   "Thai Nguyen",
   "Thanh Hoa",
   "TP Ho Chi Minh",
   "Tuyen Quang",
   "Vinh Long",
];

export default function UserProfilePage() {
   const currentUser = readAuthUser();
   const [name, setName] = useState(currentUser?.name ?? "");
   const [email, setEmail] = useState(currentUser?.email ?? "");
   const [avatarDataUrl, setAvatarDataUrl] = useState(currentUser?.avatarDataUrl ?? "");
   const [phone, setPhone] = useState(currentUser?.phone ?? "");
   const [hometown, setHometown] = useState(currentUser?.hometown ?? "");
   const [gender, setGender] = useState<"Nam" | "Nữ" | "Khác" | "">(currentUser?.gender ?? "");
   const [age, setAge] = useState(currentUser?.age ? String(currentUser.age) : "");
   const [profileMessage, setProfileMessage] = useState("");

   const userInitial = useMemo(() => {
      return currentUser?.name.trim().charAt(0).toUpperCase() ?? "U";
   }, [currentUser]);

   const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
         return;
      }

      if (!file.type.startsWith("image/")) {
         setProfileMessage("Vui lòng chọn file ảnh hợp lệ.");
         return;
      }

      const reader = new FileReader();
      reader.onload = () => {
         setAvatarDataUrl(String(reader.result));
         setProfileMessage("");
      };
      reader.readAsDataURL(file);
   };

   const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!name.trim() || !email.trim()) {
         setProfileMessage("Vui lòng nhập đầy đủ họ tên và email.");
         return;
      }

      const parsedAge = Number(age);
      if (!Number.isInteger(parsedAge) || parsedAge < 16 || parsedAge > 80) {
         setProfileMessage("Độ tuổi hợp lệ từ 16 đến 80.");
         return;
      }

      if (!hometown) {
         setProfileMessage("Vui lòng chọn quê quán.");
         return;
      }

      updateAuthUser({
         name: name.trim(),
         email: email.trim().toLowerCase(),
         avatarDataUrl,
         phone: phone.trim(),
         hometown,
         gender: gender || undefined,
         age: parsedAge,
      });
      setProfileMessage("Đã lưu thông tin hồ sơ thành công.");
   };

   if (!currentUser) {
      return (
         <section className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-black text-gray-900">Hồ sơ người dùng</h1>
            <p className="mt-2 text-sm text-gray-600">Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ.</p>
            <Link
               to="/dang-nhap"
               className="mt-5 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
               Đến trang đăng nhập
            </Link>
         </section>
      );
   }

   return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
         <h1 className="text-2xl font-black text-gray-900">Hồ sơ người dùng</h1>
         <p className="mt-2 text-sm text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản trên JobPilot.</p>

         <form onSubmit={handleSaveProfile} className="mt-6 rounded-2xl border border-gray-200 p-5">
            <h2 className="text-base font-black text-gray-900">Thông tin cá nhân</h2>

            <div className="mt-4 flex items-center gap-3">
               {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt="Avatar" className="h-16 w-16 rounded-full border border-emerald-200 object-cover" />
               ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-xl font-black text-white">
                     {userInitial}
                  </div>
               )}
               <label className="cursor-pointer rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50">
                  Đặt ảnh đại diện
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
               </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
               <div>
                  <label className="block text-sm font-bold text-gray-700">Họ và tên</label>
                  <input
                     type="text"
                     value={name}
                     onChange={(event) => setName(event.target.value)}
                     className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
                     placeholder="Nhập họ và tên"
                  />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700">Email</label>
                  <input
                     type="email"
                     value={email}
                     onChange={(event) => setEmail(event.target.value)}
                     className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
                     placeholder="ban@example.com"
                  />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700">Số điện thoại</label>
                  <input
                     type="tel"
                     placeholder="VD: 0912345678"
                     value={phone}
                     onChange={(event) => setPhone(event.target.value)}
                     className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
                  />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700">Quê quán</label>
                  <select
                     value={hometown}
                     onChange={(event) => setHometown(event.target.value)}
                     className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
                  >
                     <option value="">Chọn 1 trong 34 tỉnh/thành</option>
                     {hometownOptions.map((item) => (
                        <option key={item} value={item}>
                           {item}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700">Giới tính</label>
                  <select
                     value={gender}
                     onChange={(event) => setGender(event.target.value as "Nam" | "Nữ" | "Khác" | "")}
                     className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
                  >
                     <option value="">Chọn giới tính</option>
                     <option value="Nam">Nam</option>
                     <option value="Nữ">Nữ</option>
                     <option value="Khác">Khác</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700">Độ tuổi</label>
                  <input
                     type="number"
                     min={16}
                     max={80}
                     value={age}
                     onChange={(event) => setAge(event.target.value)}
                     className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
                  />
               </div>
            </div>

            {profileMessage && <p className="mt-4 text-sm font-semibold text-emerald-700">{profileMessage}</p>}
            <button
               type="submit"
               className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
               Lưu hồ sơ
            </button>
         </form>
      </section>
   );
}
