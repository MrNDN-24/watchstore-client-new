import React from "react";
import Banner from "../assets/banner_storestr.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const StoreDetailPage = () => {
  return (
    <div>
      <Navbar />
      <img src={Banner} />
      <div className="container mx-auto p-6">
        {/* begin introbox1 */}
        <div className="introbox1 mgminu flex justify-center items-center">
          <div className="mt-12 max-w-[800px] mx-auto leading-relaxed">
            <div className="introbox1__des"></div>
            <div className="introbox1__tit text-center">
              <h3 className="text-xl font-semibold">THÀNH LẬP NĂM 2020</h3>
              <h2 className="text-2xl font-bold">
                CAM KẾT 100% HÀNG CHÍNH HÃNG
              </h2>
            </div>
            <div className="introbox1__content space-y-4 text-center md:text-left">
              <p>
                Trải qua nhiều năm thành lập, với những nỗ lực không ngừng,
                WatchThis đã gặt hái nhiều thành công trong hoạt động kinh doanh
                và chiếm lĩnh trên thị trường.
              </p>
              <p>
                WatchThis đã đăng ký hoạt động thương mại điện tử với Bộ Công
                Thương (
                <a
                  href="http://online.gov.vn/Home/WebDetails/75019"
                  rel="nofollow noopener"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Xem giấy phép đăng ký TMĐT với Bộ Công Thương
                </a>
                ). Chúng tôi cam kết 100% sản phẩm chính hãng.
              </p>
              <p>
                <strong>Các cột mốc đáng ghi nhớ:</strong>
              </p>
              <p>
                <strong>• Năm 2020</strong>: Trở thành đại lý bán lẻ chính thức
                của thương hiệu đồng hồ Casio do Công ty Cổ Phần Anh Khuê Watch
                chứng nhận.
              </p>
              <p>
                <strong>• Năm 2021</strong>: Được cấp giấy chứng nhận đại lý ủy
                quyền bán lẻ chính thức của các thương hiệu đồng hồ cao cấp
                Orient, Seiko.
              </p>
              <p>
                <strong>• Năm 2022</strong>: Chứng nhận đại lý chính hãng của
                các thương hiệu đồng hồ Frederique Constant, Srwatch, Freelook,
                Daniel Klein.
              </p>
              <p>
                <strong>• Năm 2023</strong>: Đại lý ủy quyền chính thức của
                thương hiệu đồng hồ Citizen, Olym Pianus, Olympia Star, Ogival,
                Bentley, I&W Carnival.
              </p>
            </div>
          </div>
        </div>
        {/* end introbox1 */}

        {/* begin introbox2 */}
        <div className="introbox2 flex justify-center items-center mt-12">
          <div className="introbox1l max-w-[800px] mx-auto">
            <div className="introbox1__tit text-center">
              <h2 className="text-2xl font-bold">NGÀNH NGHỀ KINH DOANH</h2>
            </div>
            <div className="introbox1__content text-center md:text-left">
              <p>
                • <strong>Bán lẻ đồng hồ</strong>:WatchThis trở thành thương
                hiệu đồng hồ uy tín phục vụ tận tâm, chuyên nghiệp, phân phối
                đồng hồ chính hãng cho hàng nghìn khách hàng trên toàn quốc.
              </p>
              <p>
                • <strong>Bán sỉ đồng hồ cho các doanh nghiệp</strong>: Đồng hồ
                WatchThis là địa chỉ uy tín được nhiều doanh nghiệp tin tưởng
                khi tìm kiếm những mẫu đồng hồ làm quà tặng cho nhân viên, hoặc
                quà tặng đối tác.
              </p>
              <p>
                • <strong>Phân phối dây da và phụ kiện chính hãng</strong>: Hiểu
                được nhu cầu của khách hàng, WatchThis đã liên kết với các đối
                tác, chọn lọc và phân phối các phụ kiện đồng hồ chính hãng, đa
                dạng lựa chọn cho khách hàng.
              </p>
              <p>
                • <strong>Sửa chữa và bảo dưỡng đồng hồ</strong>: Bên cạnh kinh
                doanh bán lẻ đồng hồ, WatchThis còn cung cấp dịch vụ sửa chữa và
                bảo dưỡng đồng hồ chuyên nghiệp với đội ngũ kỹ thuật tay nghề
                cao.
              </p>
            </div>
          </div>
        </div>
        {/* end introbox2 */}
      </div>
      <Footer />
    </div>
  );
};

export default StoreDetailPage;
