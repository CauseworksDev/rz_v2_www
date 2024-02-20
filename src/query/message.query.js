selectMessage = (bTotalCount, messageId, memberId, categoryId, keyword, exceptPart, tag, sort, offset, numOfRows
) => {
    let missionParticipation = ``;
    let whereMessageId = ``;
    let whereCategory = ``;
    let whereKeyword = ``;
    let whereExists = ``;
    let whereTag = ``;
    let whereSort = ``;
    let limit = ``;
    let select = ``;

    if (memberId) {
        if (exceptPart == 1) {
            whereExists = `AND NOT EXISTS (
					SELECT 1 FROM MEMBER_MESSAGE_CHECK WHERE MESSAGE_ID = A.MESSAGE_ID AND MEMBER_ID = ${memberId}
				)`;
        }
    }

    if (messageId) {
        whereMessageId = `AND MESSAGE_ID = ${messageId}`
    }else{
        whereMessageId = `AND A.ACTIVE_YN = 1`
    }

    if (categoryId) {
        whereCategory = `AND A.CATEGORY = ${categoryId}`
    }
    if (keyword) {
        whereKeyword = `AND (A.TITLE LIKE CONCAT('%',${keyword},'%') OR A.CONTENT LIKE CONCAT('%',${keyword},'%'))`
    }
    if (tag) {
        whereTag = `AND EXISTS (
					SELECT 1 FROM MESSAGE_TAG WHERE MESSAGE_ID = A.MESSAGE_ID AND TAG_TEXT = ${tag}
				)`
    }
    if (sort == 1) {
        whereSort = `ORDER BY sortDtime DESC`
    } else if (sort == 2) {
        whereSort = `ORDER BY (SELECT COUNT(*) FROM \`MEMBER_MESSAGE_CHECK\` WHERE MESSAGE_ID = A.MESSAGE_ID) DESC, sortDtime DESC`
    } else if (sort == 3) {
        whereSort = `ORDER BY (SELECT COUNT(*) FROM \`MEMBER_LIKE\` WHERE LIKE_TYPE = 1 AND ARTICLE_ID = A.MESSAGE_ID) DESC, sortDtime DESC`
    } else if (sort == 4) {
        whereSort = `ORDER BY IFNULL(ORDER_BY, 999999), SORT_DTIME DESC`
    } else {
        whereSort = `ORDER BY sortDtime DESC`
    }
    if (bTotalCount === true) {
        select = `COUNT(*) AS totalCount`;
    } else {
        select = `
            A.MESSAGE_ID as messageId,
			A.MESSAGE_TYPE as messageType,
			A.CATEGORY as category,
			B.CATEGORY_NAME as categoryName,
			A.TITLE as title,
			A.CONTENT as content,
			A.IMAGE_FILE as imageFile,
			A.IMAGE_FILE2 as imageFile2,
			A.RZ_POINT as rzPoint,
			A.DONATION_POINT as donationPoint,
			A.CAMPAIGN_ID as campaignId,
			A.START_DATE_VAL_RZ as startDateValRz,
			A.END_DATE_VAL_RZ as endDateValRz,
			A.VIEW_COUNT as viewCount,
			A.RESV_DTIME as resvDtime,
			A.REG_DTIME as regDtime,
			A.REPLY_USE_YN as replyUseYN,
			A.ACTIVE_YN as activeYN,
			CASE
				WHEN A.RESV_DTIME IS NOT NULL THEN A.RESV_DTIME
				ELSE A.REG_DTIME
			END AS sortDtime
			,(SELECT COUNT(*) FROM MEMBER_REPLY WHERE REPLY_TYPE = 1 AND TARGER_ID  = A.MESSAGE_ID) replyCount
			,(SELECT COUNT(*) FROM MEMBER_LIKE  WHERE LIKE_TYPE  = 1 AND ARTICLE_ID = A.MESSAGE_ID) likeCount
			,(SELECT GROUP_CONCAT(TAG_TEXT) FROM MESSAGE_TAG WHERE MESSAGE_ID = A.MESSAGE_ID) tagTextStr
        `
        ;
        limit = `LIMIT ${offset}, ${numOfRows}`
    }
    return `
        SELECT ${select}
        FROM
            MESSAGE A
            LEFT JOIN CATEGORY B ON (B.CATEGORY_TYPE = 1 AND A.CATEGORY = B.CATEGORY_ID)
        WHERE 1=1
            ${whereMessageId} 
            ${whereCategory} 
            ${whereKeyword} 
            ${whereExists} 
            ${whereTag} 
            ${whereSort} 
            ${limit}
        ;`;
};

module.exports = {

    selectMessage

};
