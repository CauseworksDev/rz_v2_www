selectMember = (memberId
) => {

    return `
        SELECT
            MEMBER_ID as memberId,
            JOIN_CHANNEL as joinChannel,
            MEMBER_ACCOUNT_NAME as accountName,
            NICKNAME as nickName,
            MOBILE_NUM as mobileNum,
            BIRTH_YEAR as birthYear,
            GENDER as gender,
            MEMBER_CODE as memberCode,
            STATUS as status,
            RECOMMENDER_CODE as recommenderCode,
            MERKETING_TERMS_AGREE_YN as merketingTermsAgreeYN,
            JOIN_DATE as joinDate,
            ACCESS_DTIME as accessDtime,
            WITHDRAWL_DTIME as withdrawlDtime,
            LOGIN_TOKEN as loginToken,
            SNS_EMAIL_ADDRESS as snsEmailAddress
        FROM
            MEMBER
        WHERE
            MEMBER_ID = ${memberId}
            `;
};
module.exports = {

    selectMember ,

};
