# Prototype

- NUGU Speaker을 사용한 Mediger의 데모 영상입니다. [link](https://youtu.be/kT_0jlII8BA)
- Mediger의  프로토타입입니다. [link](https://www.youtube.com/watch?v=55gceGWeCUU&feature=youtu.be)

# Mockup

- Frontend : [README.md](https://github.com/LightIsLED/Front)
- 주요 라이브러리 :`React`, `apollo`, `graphql`
- Screens

1.  splash

![0  Splash](https://user-images.githubusercontent.com/26773073/69350722-67ea9300-0cbd-11ea-89a0-6f240d05f85f.png)

2.  signup

![1  Sign up](https://user-images.githubusercontent.com/26773073/69350755-746eeb80-0cbd-11ea-92a8-58f489151f71.png)

3.  Tab1 : calendar

![2  Calendar](https://user-images.githubusercontent.com/26773073/69350757-746eeb80-0cbd-11ea-9d9e-7cf8cd70d831.png)

4.  Tab2 : medicine

![3  Medicine List](https://user-images.githubusercontent.com/26773073/69350759-75078200-0cbd-11ea-9370-5100d11fd6fa.png)

5.  Tab3 : profile

![4  Profile - empty protector](https://user-images.githubusercontent.com/26773073/69350760-75078200-0cbd-11ea-9d7b-0d25fc540a58.png)



# Backend

- DB 세팅 (예원)
    - 데이터베이스 생성:
        - `sequelize db:create` 명령어를 통해 데이터베이스를 생성한다. 이후 `npm start` 또는 `node init.js` 명령어 수행 시, 테이블이 자동 생성된다.
    - config 수정: `./config/config.json`파일에서 "development" 하위의 username, password, database를 수정하여 진행한다. (username은 자신의 mysql username, password는 자신의 mysql 비밀번호, database는 자신이 설정한 database명)
    - 변경사항:
        - `intakes` 테이블 삭제
        - `schedules`에 BOOLEAN Type `intake` 컬럼 추가.
        - `schedules`는 사용자가 설정한 기간 및 설정한 특정 시간에 울려야 할 모든 알람 정보를 가짐. 예시는 아래 설명을 참고.
        - `medischedules`는 `schedules`와 `medicines`의 *다대다(n:m)* 관계를 잇기 위해 만들어짐.
            - schedule id별로 약물 id, 약물 이름, 약물 복용법이 저장됨.    
    - 설명: 
        - addForm에서 알람 이름, 알람 시작일과 종료일, 약물 리스트, 알람이 울릴 시간 리스트를 입력 받음.
        - schedules에는 알람 이름, 알람이 울리는 날짜, 유저 아이디, 알람이 울리는 시간, 복용 여부(default 0)이 입력됨.
            - 알람이 울릴 시간을 만약 오전 1시, 오전 2시로 입력받으면 기본적으로 schedule은 2종류가 만들어짐.
                - 알람 시작일을 11월 1일, 종료일을 11월 3일로 하면 기본적으로 11월 1일에 울릴 알람 2가지(오전 1시, 오전 2시), 11월 2일에 울릴 알람 2가지, 11월 3일에 울릴 알람 2가지 총 6개가 맞들어 짐.
            - 사용자가 약을 복용했다고 기록할 때, 복용 여부인 intake는 디폴트값 0에서 1로 바뀌게 됨.

- SignUp (명지)
    - express-session 설치 필요
    - home("/")에서 user 정보 확인
    - 없으면 join 페이지로 있으면 calendar 페이지로 넘어감. 
    - 서버 연결 닫히면 다시 정보 넣어야 함.
    - 변수 이름 :  `userID`

- 알람 등록 (예원) `/medicines/addForm`
    - 변수 이름
        - 알람 이름: `scheName`
        - 시작일: `startDate`
        - 종료일: `endDate`
        - 약물 리스트 & 복용량 리스트: `mediName` & `dose`
        - 알람 시간 리스트: `time`
    - 약 입력 과정
        - submit을 누르면 `/medicines/insert`로, Medicines 테이블에 있는 약이면 select, 없는 약이면 insert한 후 해당 약물 정보 `return`
        - `return`된 약물 ID를 바탕으로 Schedules 테이블에 사용자가 입력한 정보를 insert
        - _약물 입력 과정에서 정의한 기타 함수들은, 시간 또는 약이 하나일 때와 여러개일 때 변수 type이 달라져 정의한 함수들임. 주요 로직 해당 X_
    - `moment.js`설치 필요. (날짜 계산할 때 필요한 것). `npm i moment`

- 공동 Template (명지) 
    - footer.pug : `a href` 이용해 클릭할 경우 각 페이지(`/calendar`, `/medicines`, `/user`)로 넘어갈 수 있도록 함.   
    - footer.pug 사용 방법: pug 파일에서 필요한 부분에 `include footer.pug` 입력 

- 캘린더 페이지 (명지) -> 명지 수정했으니까 꼭 참고해줘!!!!!
    - `/calendar` : 가장 기본. 오늘을 기준으로 오늘-2일부터 오늘+2일까지 총 5일을 보여줌.
    - `/calendar/:date`: `/calendar`에서 선택된 날짜에 상응하는 알람 리스트를 보여줌.
        - 변수 이름
            - 선택한 날짜: `userDate`
            - 알람 리스트: `schedules`
                - `scheID`,`scheName`,`scheHour`,`scheMin`, `scheDate`, `intake`가 포함되어 있음.
                - `intake`의 경우, boolean type으로 복용했을 경우 1, 아닐 경우 0 (default 0)
        - 과정
            - `calendar` 페이지에서 `date` 선택 
                -(여기서 Date는 정말로 일자를 뜻함. 예-2019/11/24이면 `date=24`)
            - `date`와 `userID`에 맞는 알람 이름, 알람 시간(시:분) 표시됨.
            - `intake`를 기준으로 복용 여부 확인 후 색깔 표시.
            - 알람 리스트는 `calendar/:date`페이지에 반영됨.
- `Alarm Detail` 페이지 (명지) -> 이것도 꼭 읽어야해!!
    - `/calendar/:date/:scheID`
        - 변수 이름
            - 해당 알람 정보 및 하위 약 리스트: `alarms`
        - 과정 
            - 해당 알람(특정한 하나의 `scheID`)의 정보를 안내함. 
                - 즉, 하나의 `scheID` 당 하나의 Alarm Detail 페이지가 생성되는 것.
            - `복용` 버튼을 누르면, 해당 `scheID`에 상응하는 `intake` 값이 true가 됨.
            - `복용` 버튼을 누르면, `/calendar/alarmRecord`로 이동함.
    - `/calendar/alarmRecord`
        - 과정
            - `intake`가 `true`로 되고 다시 해당 날짜의 `/calendar/:date`로 넘어감.
- `medicineList` 페이지 (예원)
    - group-by 설치 필요! `$npm i group-by`
    - 사용자가 오늘 먹어야 할 알람의 리스트를 보여줌.
        - 알람에는 세부 약 이름과 복용량이 들어있음.


- 알람 (명지)
    - `npm i socket.io` 설치 필요
    - 설치했는데 안되면 물어볼것 
    - 내가 너무 package 많이 설치해서 뭐가 필요한지 기억이 안나...ㅎ.ㅎ.ㅎ

- `user profile` 페이지 (명지)
    - 변수이름 : `user`, 객체임(?).
        - `user.userName`,`user.birth`,`user.sex`(0: 남, 1: 여), `user.accompanierName`,`user.accompanierPhone` 값 포함.
    - `edit` 버튼을 누르면 수정 페이지로 넘어감.
    - `edit profile` 페이지
        - `accompanier info edit` 버튼을 눌러 보호자의 이름과 전화번호 입력할 수 있음.
        - `update`를 눌러 정보 전송.
        - 이 때 이름은 `accompanierName`, 전화번호는 `accompanierPhone`에 담겨 전송됨.
        - 그리고 다시 `user profile` 페이지로 넘어감.
    - 보호자 정보 수정 후에는 보호자 정보가 표시 됨.



# NUGU Play

- NUGU Mediger Play Action Tree
  ![actionTree](/Users/yewon/Documents/LightIsLed/Document/image/actionTree.jpg)

# 