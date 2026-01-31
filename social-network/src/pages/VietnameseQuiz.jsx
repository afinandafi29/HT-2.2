import React from 'react';
import QuizPage from '../components/QuizPage';

const VietnameseQuiz = () => (
  <QuizPage
    language="vi"
    languageCode="vi"
    pageTitle="HAPPYY TALK Vietnamese 🇻🇳"
    subtitle="Học tiếng Việt với nụ cười! (Learn with a smile!)"
    rawData={`Người mới bắt đầu|How do you say 'Happy' in Vietnamese?|Vui vẻ|Buồn||Giận||Mệt
Người mới bắt đầu|Common greeting for 'Hello':|Xin chào|Tạm biệt||Cảm ơn||Xin lỗi
Người mới bắt đầu|How to say 'Thank you'?|Cảm ơn|Không có gì||Làm ơn||Được
Người mới bắt đầu|Word for 'Friend':|Bạn bè|Kẻ thù||Người lạ||Hàng xóm
Người mới bắt đầu|What does 'Đẹp' mean?|Beautiful|Xấu||Nhỏ||Cao
Người mới bắt đầu|How to say 'I love you'?|Tôi yêu bạn|Tôi ghét bạn||Tôi đi||Tôi ngủ
Người mới bắt đầu|Which word means 'Smile'?|Nụ cười|Khóc||Ngủ||Ăn
Người mới bắt đầu|How to say 'Good morning'?|Chào buổi sáng|Chào buổi tối||Chúc ngủ ngon||Chào buổi chiều
Người mới bắt đầu|What is 'Delicious' in Vietnamese?|Ngon|Đắng||Chua||Nhạt
Người mới bắt đầu|Translate 'Success':|Thành công|Thất bại||Lỗi||Sợ
Người mới bắt đầu|How do you say 'Water'?|Nước|Lửa||Đất||Gió
Người mới bắt đầu|What is 'Ăn'?|To eat|Uống||Ngủ||Chơi
Người mới bắt đầu|Word for 'Big':|Lớn|Nhỏ||Cao||Thấp
Người mới bắt đầu|How do you say 'House'?|Nhà|Trường học||Văn phòng||Chợ
Người mới bắt đầu|What is 'Tình yêu'?|Love|Ghét||Hy vọng||Hòa bình
Người mới bắt đầu|Translate 'Today':|Hôm nay|Ngày mai||Hôm qua||Tối nay
Người mới bắt đầu|How to say '1'?|Một|Hai||Ba||Bốn
Người mới bắt đầu|What is 'Trường học'?|School|Bệnh viện||Thư viện||Công viên
Người mới bắt đầu|Word for 'Dog':|Con chó|Con mèo||Con chim||Con cá
Người mới bắt đầu|How to say 'I'm sorry'?|Xin lỗi|Chào||Cảm ơn||Làm ơn
Người mới bắt đầu|What does 'Lạnh' mean?|Cold|Nóng||Ấm||Khô
Người mới bắt đầu|Word for 'Child':|Trẻ em|Người lớn||Chú||Cô
Người mới bắt đầu|How to say 'Yes' in Vietnamese?|Vâng|Không||Có lẽ||Không bao giờ
Người mới bắt đầu|What is 'Đêm'?|Night|Ngày||Sáng||Chiều
Người mới bắt đầu|Word for 'Strong':|Mạnh mẽ|Yếu||Nhanh||Chậm
Người mới bắt đầu|How to say 'No'?|Không|Có||Thường||Luôn luôn
Người mới bắt đầu|What is 'Con cá'?|Fish|Chim||Mèo||Chó
Người mới bắt đầu|Word for 'White':|Trắng|Đen||Xám||Nâu
Người mới bắt đầu|How to say 'Please' (requesting)?|Làm ơn|Cảm ơn||Vâng||Không
Người mới bắt đầu|What does 'Sáng' mean?|Bright|Tối||Bóng||Đêm
Người mới bắt đầu|Word for 'Life':|Cuộc sống|Chết||Ngủ||Mơ
Người mới bắt đầu|How do you say 'Book'?|Sách|Bút||Giấy||Bàn
Người mới bắt đầu|What is 'Mặt trăng'?|Moon|Mặt trời||Ngôi sao||Bầu trời
Người mới bắt đầu|Word for 'Green':|Xanh lá|Đỏ||Xanh dương||Vàng
Người mới bắt đầu|How to say 'Mother'?|Mẹ|Cha||Anh||Chị
Trung cấp|How do you say 'Good luck'?|Chúc may mắn|Chúc ngủ ngon||Chúc sức khỏe||Chúc mừng
Trung cấp|What is 'Peace'?|Hòa bình|Chiến tranh||Ồn ào||Đông đúc
Trung cấp|Translate: 'Everything is fine.'|Mọi thứ đều ổn|Mọi thứ tệ quá||Tôi không biết||Dừng lại
Trung cấp|Word for 'Hope':|Hy vọng|Thất vọng||Sợ hãi||Buồn rầu
Trung cấp|How to say 'I'm proud of you'?|Tôi tự hào về bạn|Tôi giận bạn||Tôi nghi ngờ bạn||Tôi biết bạn
Trung cấp|What is 'Sự ngạc nhiên' in English?|Surprise|Chán nản||Đau buồn||Giận dữ
Trung cấp|Translate 'Experience':|Kinh nghiệm|Hy vọng||Ước mơ||Nhiệm vụ
Trung cấp|How do you say 'Opportunity'?|Cơ hội|Trở ngại||Vấn đề||Thất bại
Trung cấp|What does 'Cẩn thận' mean?|Be careful|Hãy vui vẻ||Hãy nhanh lên||Hãy im lặng
Trung cấp|Translate 'Important':|Quan trọng|Dễ dàng||Nhanh chóng||Rẻ
Trung cấp|How do you say 'Health'?|Sức khỏe|Sức mạnh||Giàu có||Vẻ đẹp
Trung cấp|What is 'Tự tin'?|Confident|Nhút nhát||Sợ hãi||Lười biếng
Trung cấp|Translate 'Environment':|Môi trường|Phòng||Nhà||Đường phố
Trung cấp|How do you say 'Challenge'?|Thử thách|Món quà||Sự giúp đỡ||Sự hỗ trợ
Trung cấp|What is 'Làm việc chăm chỉ'?|Hard work|Ngày lười biếng||Nhiệm vụ dễ dàng||Thời gian rảnh
Trung cấp|Translate 'Progress':|Tiến bộ|Thoái bộ||Cái chết||Sự ra đời
Trung cấp|How to say 'I agree'?|Tôi đồng ý|Tôi không muốn||Tôi bối rối||Tôi đi
Trung cấp|What does 'Khác biệt' mean?|Different|Giống nhau||Bằng nhau||Tương tự
Trung cấp|Translate 'Respect':|Tôn trọng|Ghét||Sợ hãi||Giận dữ
Trung cấp|How to say 'Believe'?|Tin tưởng|Nghi ngờ||Hỏi||Im lặng
Trung cấp|What is 'Tương lai'?|Future|Quá khứ||Hiện tại||Hôm nay
Trung cấp|Translate 'Create':|Sáng tạo|Phá hủy||Chờ đợi||Tìm kiếm
Trung cấp|How do you say 'Freedom'?|Tự do|Phụ thuộc||Nghĩa vụ||Gánh nặng
Trung cấp|What is 'Sự hợp tác'?|Collaboration|Cạnh tranh||Xung đột||Trốn tránh
Trung cấp|Translate 'Change':|Thay đổi|Trật tự||Im lặng||Kết thúc
Trung cấp|How to say 'Happy' (formal)?|Hạnh phúc|Bất hạnh||Thất vọng||Giận dữ
Trung cấp|What is 'Cảm xúc'?|Feelings|Suy nghĩ||Hành động||Tầm nhìn
Trung cấp|Translate 'Grateful':|Biết ơn|Phàn nàn||Giận dữ||Buồn bã
Trung cấp|How to say 'Celebrate'?|Kỷ niệm|Khóc||Rời đi||Quên
Trung cấp|What is 'Cảm hứng'?|Inspiration|Sự nhàm chán||Sự im lặng||Sợ hãi
Trung cấp|Translate 'Honest':|Thật thà|Dối trá||Sợ hãi||Nghi ngờ
Trung cấp|How to say 'Beautiful' (scenery)?|Tuyệt đẹp|Xấu xí||Bình thường||Bẩn
Trung cấp|What is 'Giao tiếp'?|Communication|Im lặng||Tranh cãi||Đấu tranh
Trung cấp|Translate 'Kindness':|Sự tử tế|Sự độc ác||Sự thù hận||Sự giận dữ
Trung cấp|How to say 'Patience'?|Kiên nhẫn|Giận dữ||Lo lắng||Sợ hãi
Cao cấp|What is 'Bình yên'?|Inner peace / Tranquility|Chaos||Wealth||Fast music
Cao cấp|Translate 'Gratitude':|Lòng biết ơn|Tham lam||Ghét bỏ||Ích kỷ
Cao cấp|Meaning of 'Hạnh phúc'?|Happiness (Deep/Enduring)|Short laugh||Money||Sadness
Cao cấp|What is 'Yêu đời'?|Loving life / Optimistic|Tired of life||Scared of death||Busy
Cao cấp|What is 'Sự đa dạng'?|Diversity|Đơn điệu||Giống nhau||Tương tự
Cao cấp|Translate 'Chính trực':|Integrity|Cẩu thả||Lừa dối||Gian lận
Cao cấp|Meaning of 'Sự thịnh vượng'?|Prosperity / Welfare|Nghèo đói||Khổ cực||Khó khăn
Cao cấp|What is 'Quyền tự quyết'?|Sovereignty / Autonomy|Sự phụ thuộc||Sự yếu đuối||Sợ hãi
Cao cấp|Translate 'Sự đoàn kết':|Solidarity|Chia rẽ||Thù hận||Ghen tị
Cao cấp|What is 'Sự khôn ngoan'?|Wisdom|Sự ngu ngốc||Sự thiếu hiểu biết||Sự tham lam
Cao cấp|Translate 'Lòng trắc ẩn':|Compassion|Sự tàn nhẫn||Sự thù hận||Sự giận dữ
Cao cấp|Meaning of 'Sự bền vững'?|Sustainability|Sự hủy diệt||Ô nhiễm||Lãng phí
Cao cấp|What is 'Công lý'?|Justice|Bất công||Hỗn loạn||Tham nhũng
Cao cấp|Translate 'Sự hài hòa':|Harmony|Xung đột||Tiếng ồn||Giận dữ
Cao cấp|Meaning of 'Sự độc lập'?|Independence|Nô lệ||Chủ nghĩa thực dân||Cai trị
Cao cấp|What is 'Sự trang nhã'?|Elegance|Sự vụng về||Sự xấu xí||Sự thô lỗ
Cao cấp|Translate 'Thư viện':|Library|Hiệu sách||Trường học||Lớp học
Cao cấp|Meaning of 'Sự trung thành'?|Loyalty|Sự phản bội||Sự thù hận||Sự giận dữ
Cao cấp|What is 'Sự sáng tạo'?|Creativity|Sự bắt chước||Sự nhàm chán||Sự lười biếng
Cao cấp|Translate 'Lòng dũng cảm':|Courage|Sợ hãi||Sự hèn nhát||Sự nhút nhát
Cao cấp|Meaning of 'Sự chân thành'?|Sincerity|Sự đạo đức giả||Lời nói dối||Tham lam
Cao cấp|What is 'Vinh quang'?|Glory / Honor|Sự xấu hổ||Thất bại||Mất mát
Cao cấp|Translate 'Sức khỏe tâm thần':|Mental health|Nỗi đau thể xác||Cơ thể bệnh tật||Tinh thần yếu
Cao cấp|Meaning of 'Sự hiếu khách'?|Hospitality|Sự bất lịch sự||Sự lạnh lùng||Sự giận dữ
Cao cấp|What is 'Phép màu'?|Miracle|Thảm họa||Tai nạn||Bình thường
Cao cấp|Translate 'Trao quyền':|Empowerment|Hạn chế||Sự yếu thế||Sợ hãi
Cao cấp|Meaning of 'Sự kiên trì'?|Persistence / Endurance|Kết thúc||Dừng lại||Lãng phí
Cao cấp|What is 'Lòng rộng lượng'?|Generosity|Sự tham lam||Sự ích kỷ||Sự keo kiệt
Cao cấp|Translate 'Sự đổi mới':|Innovation|Sự trì trệ||Truyền thống||Cũ kỹ
Cao cấp|Final one! Casually say 'Cheers!'|Dô!|Đi!||Không!||Dừng!`}
    speechLocale="vi-VN"
    primaryColor="#3b82f6"
    primaryHover="#2563eb"
    resultTitle="Tuyệt vời! (Excellent!)"
    resultMessage="Tiếng Việt của bạn rất tuyệt!"
    retryLabel="Làm lại"
    levelLabels={{
      'Người mới bắt đầu': 'Beginner',
      'Trung cấp': 'Intermediate',
      'Cao cấp': 'Advanced'
    }}
  />
);

export default VietnameseQuiz;
