selectMission = (bTotalCount, missionId, memberId, myMission, categoryId, keyword, exceptPart, tag, sort, offset, numOfRows
) => {
    let missionParticipation = ``;
    let whereMyMission = ``;
    let whereMissionId = ``;
    let whereCategory = ``;
    let whereKeyword = ``;
    let whereExists = ``;
    let whereTag = ``;
    let whereSort = ``;
    let limit = ``;
    let select = ``;

    if (memberId) {
        missionParticipation = `
        (SELECT COUNT(*) FROM MISSION_PARTICIPATION MP
				WHERE MISSION_ID = A.MISSION_ID AND MEMBER_ID = #{memberId} AND DATE_FORMAT(MP.REG_DTIME, '%Y%m%d') = DATE_FORMAT(now(), '%Y%m%d') ) todayApplyCnt`;

        if (exceptPart == 1) {
            whereExists = `AND NOT EXISTS (
					SELECT 1 FROM MISSION_PARTICIPATION WHERE MISSION_ID = A.MISSION_ID AND MEMBER_ID = ${memberId}	
					AND ( MAX_PARTICIPATION_NUM = PARTICIPATION_METHOD ) )`;
        }
    }
    if (myMission === 0) {
        whereMyMission = `
            AND A.START_DATE_VALUE &lt;= UNIX_TIMESTAMP() 
            AND A.END_DATE_VALUE &gt; UNIX_TIMESTAMP()  
            AND A.ACTIVE_YN = 1 
        `;
    }
    if (missionId) {

        whereMissionId = `AND A.MISSION_ID = ${missionId}`
    }
    if (categoryId) {
        whereCategory = `AND A.CATEGORY = ${categoryId}`
    }
    if (keyword) {
        whereKeyword = `AND (A.TITLE LIKE CONCAT('%',${keyword},'%') OR A.DESCRIPTION LIKE CONCAT('%',${keyword},'%'))`
    }
    if (tag) {
        whereTag = `AND EXISTS (
					SELECT 1 FROM MISSION_TAG WHERE MISSION_ID = A.MISSION_ID AND TAG_TEXT = ${tag}
				)`
    }
    if (sort == 1) {
        whereSort = `ORDER BY SORT_DTIME DESC, A.MISSION_ID DESC`
    } else if (sort == 2) {
        whereSort = `ORDER BY (SELECT COUNT(*) FROM \`MISSION_PARTICIPATION\` WHERE MISSION_ID = A.MISSION_ID) DESC, SORT_DTIME DESC, A.MISSION_ID DESC`
    } else if (sort == 3) {
        whereSort = `ORDER BY (SELECT COUNT(*) FROM \`MEMBER_LIKE\` WHERE LIKE_TYPE = 2 AND ARTICLE_ID = A.MISSION_ID) DESC, SORT_DTIME DESC, A.MISSION_ID DESC`
    } else if (sort == 4) {
        whereSort = `ORDER BY IFNULL(ORDER_BY, 999999), SORT_DTIME DESC, A.MISSION_ID DESC`
    } else {
        whereSort = `ORDER BY SORT_DTIME DESC, A.MISSION_ID DESC`
    }
    if (bTotalCount === true) {
        select = `COUNT(*) AS totalCount`;
    } else {
        select = `
                A.MISSION_ID as missionId,
                A.MISSION_TYPE as missionType,
                A.CATEGORY as category,
                B.CATEGORY_NAME as categoryName,
                A.TITLE as title,
                A.DESCRIPTION as description,
                A.IMAGE_FILE as imageFile,
                A.IMAGE_FILE2 as imageFile2,
                A.START_DATE_VALUE as startDateValue,
                A.END_DATE_VALUE as endDateValue,
                A.PARTICIPATION_METHOD as participationMethod,
                A.MAX_PARTICIPATION_NUM as maxParticipationNum,
                A.RZ_POINT_PER as rzPointPer,
                A.EXTRA_RZ_PERIOD as extraRzPeriod,
                A.EXTRA_RZ_POINT as extraRzPoint,
                A.TOTAL_RZ_POINT as totalRzPoint,
                A.CAMPAIGN_ID as campaignId,
                A.DONATION_POINT_PER as donationPointPer,
                A.OX_SOLUTION as oxSolution,
                A.GUIDE_TEXT as guideText,
                A.VIEW_COUNT as viewCount,
                A.RESV_DTIME as resvDtime,
                A.REG_DTIME as regDtime,
                A.REPLY_USE_YN as replyUseYN,
                A.ACTIVE_YN as activeYN,
                CASE
                WHEN A.RESV_DTIME IS NOT NULL THEN A.RESV_DTIME
                ELSE A.REG_DTIME
                END AS sortDtime
                ${missionParticipation}
                ,(SELECT COUNT(*) FROM MISSION_PARTICIPATION WHERE MISSION_ID = A.MISSION_ID) participationCount
                ,(SELECT COUNT(*) FROM MEMBER_REPLY WHERE REPLY_TYPE = 2 AND TARGER_ID = A.MISSION_ID) replyCount
                ,(SELECT COUNT(*) FROM MEMBER_LIKE WHERE LIKE_TYPE = 2 AND ARTICLE_ID = A.MISSION_ID) likeCount
            
        `
        ;
        limit = `LIMIT ${offset}, ${numOfRows}`
    }
    return `
        SELECT ${select}
        FROM MISSION A
                 LEFT JOIN CATEGORY B ON (B.CATEGORY_TYPE = 2 AND A.CATEGORY = B.CATEGORY_ID)
        WHERE A.REGST_YN = 1
            ${whereMyMission} 
            ${whereMissionId} 
            ${whereCategory} 
            ${whereKeyword} 
            ${whereExists} 
            ${whereTag} 
            ${whereSort} 
            ${limit}
        ;`;
};
selectMissionParticipationMemberCount = (missionId,memberId,onlyActiveItemYn) => {
    let whereOnlyActiveItemYn = ``
    if(onlyActiveItemYn == 1){
        whereOnlyActiveItemYn = `AND ACTIVE_YN =1`
    }
    return `
        SELECT COUNT(*) as totalCount
        FROM MISSION_PARTICIPATION
        WHERE 1 = 1
          AND MISSION_ID = ${missionId}
          AND MEMBER_ID = ${memberId}
          ${whereOnlyActiveItemYn}
    `;
};
selectMissionRetrievalCount = (missionId,memberId) => {

    return `
        SELECT COUNT(*) as totalCount
        FROM MEMBER_BLACKLIST_SUBTRACTED
        WHERE 1=1 
          AND MEMBER_ID = ${memberId}
          AND MISSION_ID = ${missionId}
    `;
};

module.exports = {

    selectMission,
    selectMissionParticipationMemberCount,
    selectMissionRetrievalCount,

};
