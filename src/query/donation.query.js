addLgChemDonation = (campaignId,rzPoint
) => {

    return `
    UPDATE DONATION_CAMPAIGN
		SET
			LG_CHEM_DONATION_ADDITION = LG_CHEM_DONATION_ADDITION + ${rzPoint}
		WHERE
			CAMPAIGN_ID ='${campaignId}'
    ;`;
};
selectDonationCampaign = (campaignId
) => {

    return `
        SELECT
            A.CAMPAIGN_ID as campaignId,
            A.CATEGORY as category,
            C.CATEGORY_NAME as categoryName,
            A.TITLE as title,
            A.DESCRIPTION as description,
            A.IMAGE_FILE as imageFile,
            A.IMAGE_FILE2 as imageFile2,
            A.ORGANIZATION_ID as organizationId,
            B.ORGANIZATION_NAME as organizationName,
            B.HOMEPAGE as hompage,
            A.MAX_TARGET_AMOUNT as maxTargetAmount,
            A.LG_CHEM_DONATION_NAME as lgChemDonationName,
            A.LG_CHEM_DONATION_AMOUNT as lgChemDonationAmount,
            A.LG_CHEM_DONATION_ADDITION as lgChemDonationAddition,
            A.LG_CHEM_DONATION_YN as lgChemDonationYN,
            (SELECT IFNULL(SUM(RZ_POINT), 0) FROM DONATED_POINT WHERE CAMPAIGN_ID = A.CAMPAIGN_ID AND DONATION_TYPE = 2) totalDonatedAmountBycompany,
            (SELECT IFNULL(SUM(RZ_POINT), 0) FROM DONATED_POINT WHERE CAMPAIGN_ID = A.CAMPAIGN_ID AND DONATION_TYPE = 1) totalDonatedAmountBymember1,
            (SELECT IFNULL(SUM(RZ_POINT), 0) FROM DONATED_POINT WHERE CAMPAIGN_ID = A.CAMPAIGN_ID AND DONATION_TYPE = 3) totalDonatedAmountBymember3,
            A.START_DATE_VALUE as startDateValue,
            A.END_DATE_VALUE as endDateValue,
            A.RESV_DTIME as resvDtime,
            A.REG_DTIME as regDtime
        FROM
            DONATION_CAMPAIGN A
                INNER JOIN ORGANIZATION B ON (A.ORGANIZATION_ID = B.ORGANIZATION_ID)
                LEFT JOIN CATEGORY C ON (C.CATEGORY_TYPE = 3 AND A.CATEGORY = C.CATEGORY_ID)
        WHERE
            A.CAMPAIGN_ID = ${campaignId}
    ;`;
};
selectDonationSubCampaign = (
) => {

    return `
        SELECT
            A.CAMPAIGN_ID as campaignId,
            A.CATEGORY as category,
            C.CATEGORY_NAME as categoryName,
            A.TITLE as title,
            A.DESCRIPTION as description,
            A.IMAGE_FILE as imageFile,
            A.IMAGE_FILE2 as imageFile2,
            A.ORGANIZATION_ID as organizationId,
            B.ORGANIZATION_NAME as organizationName,
            B.HOMEPAGE as hompage,
            A.MAX_TARGET_AMOUNT as maxTargetAmount,
            A.LG_CHEM_DONATION_NAME as lgChemDonationName,
            A.LG_CHEM_DONATION_AMOUNT as lgChemDonationAmount,
            A.LG_CHEM_DONATION_ADDITION as lgChemDonationAddition,
            A.LG_CHEM_DONATION_YN as lgChemDonationYN,
            (SELECT IFNULL(SUM(RZ_POINT), 0) FROM DONATED_POINT WHERE CAMPAIGN_ID = A.CAMPAIGN_ID AND DONATION_TYPE = 2) totalDonatedAmountBycompany,
            (SELECT IFNULL(SUM(RZ_POINT), 0) FROM DONATED_POINT WHERE CAMPAIGN_ID = A.CAMPAIGN_ID AND DONATION_TYPE = 1) totalDonatedAmountBymember1,
            (SELECT IFNULL(SUM(RZ_POINT), 0) FROM DONATED_POINT WHERE CAMPAIGN_ID = A.CAMPAIGN_ID AND DONATION_TYPE = 3) totalDonatedAmountBymember3,
            A.START_DATE_VALUE as startDateValue,
            A.END_DATE_VALUE as endDateValue,
            A.RESV_DTIME as resvDtime,
            A.REG_DTIME as regDtime
        FROM
            DONATION_CAMPAIGN A
                INNER JOIN ORGANIZATION B ON (A.ORGANIZATION_ID = B.ORGANIZATION_ID)
                LEFT JOIN CATEGORY C ON (C.CATEGORY_TYPE = 3 AND A.CATEGORY = C.CATEGORY_ID)
        WHERE 1=1
            AND A.CAMPAIGN_TP = 2
            AND A.ACTIVE_YN = 0
        order by campaignId desc
    ;`;
};

insertDonatedPoint = (donated
) => {

    return `
        INSERT INTO DONATED_POINT
        (
            CAMPAIGN_ID,
            MEMBER_ID,
            DONATION_TYPE,
            DONOR_NAME,
            DONOR_EMAIL,
            DONATION_REASON,
            DONATION_ARTICLE_TYPE,
            DONATION_ARTICLE_ID,
            RZ_POINT,
            REG_DTIME
        )
        VALUES
            (
                '${donated.campaignId}',
                '${donated.memberId}',
                '${donated.donationType}',
                '${donated.donorName}',
                '${donated.donorEmail}',
                "${donated.donationReason}",
                '${donated.articleType}',
                '${donated.articleId}',
                '${donated.rzPoint}',
                NOW()
            )
    ;`;
};
module.exports = {

    addLgChemDonation ,
    selectDonationCampaign,
    selectDonationSubCampaign,
    insertDonatedPoint,

};
