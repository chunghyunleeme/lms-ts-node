# lms-ts-node

## 1. Outline

### 1.1. Introduction

아래의 조건을 만족하는 강의 시스템 API를 구현해주세요.
모든 테이블/프로젝트 구조는 본인이 아는 선에서 가장 좋은 형태로 만들어 주세요.
URL을 비롯해서 테이블명, 클래스명, 파일명, function명 등 아래 서술된 내용을 제외한 모든 내용들은 할 수 있는 가장 좋은 컨벤션을 따라 진행합니다.
직접 서비스 한다는 생각으로 최대한 협업하기 좋고, 견고하고, 구조화되고, 확장에 열려 있는 구조로 프로젝트를 만들어주세요.

### 1.2. Directories

```
📦src
┣ 📂common
┃ ┣ 📂error
┃ ┃ ┣ 📂http-error// HTTP 응답 에러 클래스
┃ ┣ 📂pagination // 페이징 관련 클래스
┃ ┗ 📂util // 유틸 클래스
┣ 📂lecture // 강의 애그리거트
┃ ┣ 📂application // 애플리케이션 계층
┃ ┃ ┣ 📂adapter // 외부 API 인터페이스
┃ ┣ 📂domain // 도메인 계층
┃ ┃ ┣ 📂repository // 레포지토리 인터페이스
┃ ┃ ┃ ┣ 📂dto // 검색 및 응답 dto
┃ ┣ 📂infra // 인프라 계층
┃ ┃ ┣ 📂adapter // 외부 API 구현체
┃ ┃ ┗ 📂repository // 레포지토리 구현체
┃ ┣ 📂interface // 인터페이스 계층
┃ ┣ 📂routes // 라우터
┣ 📂student // 학생 애그리거트
┣ 📂instructor // 강사 애그리거트
┣ 📂middleware // 미들웨어
┣ 📜app.config.ts // 앱 의존성 주입
┣ 📜app.ts
┣ 📜db.ts
┗ 📜server.ts
```

## 2. Installation

### 2.1. NodeJS

```
v18.10.0
```

### 2.2. MySQL

```
# PULL DOCKER MySQL IMAGE
docker pull mysql

# RUN DOCKER MySQL
docker run --name mysql-lms -e MYSQL_ROOT_PASSWORD=1234 -d -p 3306:3306 mysql:latest

# CREATE DATABASE
mysql> CREATE DATABASE lms
```

### 2.3. Repository

```
# CLONE REPOSITORY
git clone ${REPOSITORY}
cd lms-ts-node

# INSTALL DEPENDENCIES
npm install

# START DEVELOPMENT
npm run dev
```

### 2.4. Data

```
# Seed initial data
npm run setup

# Run test code
npm run test
```

## 3. Development

### 3.1. ERD

![Alt text](image.png)

### 3.2 설계

**도메인 설계**
```
강사, 강의, 수강생 세가지의 도메인이 있습니다.
강의와 수강생의 관계는 다대다 관계이므로 사이에 연관 관계 테이블이 필요합니다.
연관 관계 테이블은 수강(enrollment)입니다.
수강 테이블을 강의 도메인의 하위 엔티티로 분류하였습니다.
따라서 수강에 관련 된 기능은 루트 애그리거트인 강의 도메인에서 처리하게 됩니다.
```

**계층형 구조**
```
도메인, 애플리케이션, 인터페이스, 인프라 계층을 가집니다.
계층간 참조는 상위(우측)에서 하위(좌측)로 향합니다.
레포지토리 혹은 외부 API 사용과 같은 인프라 계층의 기능이 필요시
인터페이스를 하위 계층에 두고, 인프라 계층에 구현체를 두어 하위 계층은 추상화에만 의존합니다.
```

### 3.3 구현시 고려사항

**강의 목록 조회**
```
강의 목록 조회시 강사, 수강, 학생 테이블도 함께 조회되어야 합니다.
강사는 강의 입장에서 다대일 관계이기 때문에 JOIN을 사용해도 문제가 없습니다.
수강은 강의 입장에서 일대다 관계이기 때문에 단순히 JOIN을 사용하면 페이징에 문제가 생깁니다.
이에 따라 강의를 조회하는 쿼리, 강의 id를 가진 수강을 조회하는 쿼리로 분리 되어야 합니다.

하지만 여기서 학생 id로 검색하는 조건이 추가적으로 존재합니다.
이에 따라 학생 테이블은 JOIN은 하되, SELECT는 하지 않고 DISTINCT 키워드를 붙여 페이징을 위해 강의를 먼저 조회합니다.

성능을 위해 강의를 조회하는 쿼리 결과 나오는 강의 배열 안에서 강의 하나씩 id를 가져와 매핑하는 방식이 아닌
WHERE IN 절을 이용해 강의 id의 배열로 조회 후 매핑하는 방식을 이용하였습니다.
이결과 필요한 쿼리는 총갯수를 위한 COUNT 쿼리, 강의 목록 조회 쿼리, 수강(+학생) 조회 쿼리 총 3번으로 해결되며,
N+1 과 같은 ORM에서 자주 나타나는 성능 문제를 해결합니다.
```

**강의 등록, 수강신청 등에서의 병렬처리**
```
강의 등록과 수강신청에서 N개의 데이터를 한번에 저장하는 요구사항이 있습니다.
이때 일부의 데이터의 오류를 대비해 트랜잭션이 필요합니다.
트랜잭션은 기본적으로 단일 커넥션에 대해 에러 발생시 롤백 시켜주는 기능입니다.

단일 커넥션을 사용하게 되면, 성능을 위해 Promise.all과 같은 병렬처리 방식으로 코드를 구현하여도 병렬로서의 기능을 하지 못합니다.
이 경우, 병렬처리 하고자 하는 각각의 요청에서 커넥션을 직접 받아온후, 받아온 커넥션을 배열에 담아 변수로 관리합니다.
Promise.all 이 아닌 Promise.allSettled을 사용하여, 모든 함수가 수행된 후 최종 상태값을 확인합니다.
이 때, reject 된 값이 있으면 위에 관리하던 커넥션 배열을 전부 롤백 시킵니다.

위의 방식으로 구현시 고려사항은 N개의 데이터를 한번에 병렬로 처리하면, 커넥션도 N개를 모두 차지하게 되므로
해당 함수에서 사용할 커넥션의 갯수를 지정해 두고, 그 갯수만큼 데이터를 chunk 배열로 나눠 처리하는 방식으로 최종 구현하였습니다.
```

**테스트**
