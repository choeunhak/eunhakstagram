/**
  1. 유저 프로파일 페이지
  (1) 유저 프로파일 페이지 구독하기, 구독취소
  (2) 구독자 정보 모달 보기
  (3) 구독자 정보 모달에서 구독하기, 구독취소
  (4) 유저 프로필 사진 변경
  (5) 사용자 정보 메뉴 열기 닫기
  (6) 사용자 정보(회원정보, 로그아웃, 닫기) 모달
  (7) 사용자 프로파일 이미지 메뉴(사진업로드, 취소) 모달 
  (8) 구독자 정보 모달 닫기
 */

// (1) 유저 프로파일 페이지 구독하기, 구독취소
function toggleSubscribe(toUserId, obj) {
	if ($(obj).text() === "구독취소") {
		$.ajax({
			type: "delete",
			url: "/api/subscribe/" + toUserId,
			dataType: "json",
		}).done((res) => {
			$(obj).text("구독하기");
			$(obj).toggleClass("blue");
		}).fail(error=>{
			console.log("구독취소실패",error);
		});
	} else {
		$.ajax({
			type: "post",
			url: "/api/subscribe/" + toUserId,
			dataType: "json",
		}).done((res) => {
			$(obj).text("구독취소");
			$(obj).toggleClass("blue");
		}).fail(error=>{
			console.log("구독하기실패",error);
		});
	}
}

// (2) 구독자 정보  모달 보기
function subscribeInfoModalOpen(pageUserId) {
	$(".modal-subscribe").css("display", "flex");
	
	
	$.ajax({
		url: `/api/user/${pageUserId}/subscribe`,
		dataType:"json"
	}).done((res) => {
			console.log(res.data);
			
			res.data.forEach((u) => {
				let item = getSubscribeModalItem(u);
				$("#subscribeModalList").append(item);
			});
			
		}).fail((error) => {
			console.log("오류 : " + error);
		});
	
}

function getSubscribeModalItem(u) {
	let item = `<div class="subscribe__item" id="subscribeModalItem-${u.userId}">`;
	item += `<div class="subscribe__img">`;
	item += `<img src="/upload/${u.profileImageUrl}" alt=""  onerror="this.src='/images/person.jpeg'"/>`;
	item += `</div>`;
	item += `<div class="subscribe__text">`;
	item += `<h2>${u.username}</h2>`;
	item += `</div>`;
	item += `<div class="subscribe__btn">`;
	if (!u.equalUserState) {
		if (u.subscribeState) {
			item += `<button class="cta blue" onclick="toggleSubscribe(${u.userId}, this)">구독취소</button>`;
		} else {
			item += `<button class="cta" onclick="toggleSubscribe(${u.userId}, this)">구독하기</button>`;
		}
	}
	item += `</div>`;
	item += `</div>`;
	return item;
}

// (4) 유저 프로파일 사진 변경 (완)
function profileImageUpload(pageUserId, principalId) {
	
	if(pageUserId!=principalId){
		alert("프로필 사진을 수정할 수 없는 유저입니다.")
		
		return;
	}
	$("#userProfileImageInput").click();

	$("#userProfileImageInput").on("change", (e) => {
		let f = e.target.files[0];

		if (!f.type.match("image.*")) {
			alert("이미지를 등록해야 합니다.");
			return;
		}
		
		let profileImageForm = $("#userProfileImageForm")[0];
		
		//form데이터를 전송하려면 formData로 받는다
		//form데이터 객체를 이용하면 form 태그의 필드와 그 값을 나타내는 일련의 keyvalue쌍을 담을수있따.
		
		let formData = new FormData(profileImageForm); // Form태그 데이터 전송 타입을 multipart/form-data 로 만들어줌.

		$.ajax({
			type: "put",
			url: "/api/user/" + principalId + "/profileImageUrl",
			data: formData,
			contentType: false, //사진전송필수  x-www-form-urlencoded로 파싱됨.
			processData: false, //사진전송 필수 : contentType을 false로 줬을 때 쿼리 스트링으로 자동 설정됨. 그거 해제 하는 법
			enctype: "multipart/form-data", // 필수 아님
			dataType: "json"
		}).done(res => {

			// 사진 전송 성공시 이미지 변경
			let reader = new FileReader();
			reader.onload = (e) => {
				$("#userProfileImage").attr("src", e.target.result);
			}
			reader.readAsDataURL(f); // 이 코드 실행시 reader.onload 실행됨.
		}).fail(error=>{
			console.log("프로필사진업로드 오류", error)
		});

		// 사진 전송 성공시 이미지 변경
		let reader = new FileReader();
		reader.onload = (e) => {
			$("#userProfileImage").attr("src", e.target.result);
		}
		reader.readAsDataURL(f); // 이 코드 실행시 reader.onload 실행됨.
	});
}


// (5) 사용자 정보 메뉴 열기 닫기
function popup(obj) {
	$(obj).css("display", "flex");
}

function closePopup(obj) {
	$(obj).css("display", "none");
}


// (6) 사용자 정보(회원정보, 로그아웃, 닫기) 모달
function modalInfo() {
	$(".modal-info").css("display", "none");
}

// (7) 사용자 프로파일 이미지 메뉴(사진업로드, 취소) 모달
function modalImage() {
	$(".modal-image").css("display", "none");
}

// (8) 구독자 정보 모달 닫기
function modalClose() {
	$(".modal-subscribe").css("display", "none");
	location.reload();
}






