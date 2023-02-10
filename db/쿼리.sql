-- 테이블 myapp.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modified_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 테이블 myapp.sysla02 구조 내보내기
CREATE TABLE IF NOT EXISTS `SYSLA02` (
  `nProjectID` decimal(22,0) NOT NULL,
  `nModuleID` decimal(22,0) NOT NULL,
  `sID` varchar(255) CHARACTER SET euckr COLLATE euckr_bin NOT NULL,
  `nRevision` decimal(22,0) NOT NULL,
  `nDBType` decimal(22,0) NOT NULL,
  `sQuery` varchar(1000) CHARACTER SET euckr COLLATE euckr_bin DEFAULT NULL,
  `sQueryText` text CHARACTER SET euckr COLLATE euckr_bin DEFAULT NULL,
  `nDBMSID` decimal(22,0) DEFAULT NULL,
  PRIMARY KEY (`nProjectID`,`nModuleID`,`sID`,`nRevision`,`nDBType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 테이블 myapp.sysla03 구조 내보내기
CREATE TABLE IF NOT EXISTS `SYSLA03` (
  `nProjectID` decimal(22,0) NOT NULL,
  `nModuleID` decimal(22,0) NOT NULL,
  `sID` varchar(255) CHARACTER SET euckr COLLATE euckr_bin NOT NULL,
  `nRevision` decimal(22,0) NOT NULL,
  `nIndex` decimal(22,0) NOT NULL,
  `sColumnName` varchar(50) CHARACTER SET euckr COLLATE euckr_bin DEFAULT NULL,
  `nDataType` decimal(22,0) DEFAULT NULL,
  `nDataMode` decimal(22,0) DEFAULT NULL,
  `sTestData` varchar(255) CHARACTER SET euckr COLLATE euckr_bin DEFAULT NULL,
  PRIMARY KEY (`nProjectID`,`nModuleID`,`sID`,`nRevision`,`nIndex`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 테이블 myapp.sysla04 구조 내보내기
CREATE TABLE IF NOT EXISTS `SYSLA04` (
  `nProjectID` decimal(22,0) NOT NULL,
  `nModuleID` decimal(22,0) NOT NULL,
  `sID` varchar(255) CHARACTER SET euckr COLLATE euckr_bin NOT NULL,
  `nRevision` decimal(22,0) NOT NULL,
  `nIndex` decimal(22,0) NOT NULL,
  `sColumnName` varchar(50) CHARACTER SET euckr COLLATE euckr_bin DEFAULT NULL,
  `sNodeName` varchar(50) CHARACTER SET euckr COLLATE euckr_bin DEFAULT NULL,
  `nDataType` decimal(22,0) DEFAULT NULL,
  PRIMARY KEY (`nProjectID`,`nModuleID`,`sID`,`nRevision`,`nIndex`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `users` (`id`, `username`, `password`, `email`, `salt`, `created_at`, `created_by`, `modified_at`, `modified_by`) VALUES
	(8, 'admin', 'bf3da9364310e34b4a2111d8e88407c8c850f2e6410691abc536393f2aac51143cb112d5294dd9b63778effefdc2ccae49d7431c547288b7d51c7183badd10159ce9872dcffbe970df9a76482b632c34d3d4e4d88abbcdbde0ea1677524c1314766f27f711eb665b9c4b1b140fa2edefce3e251ef6404a85e960bdfb191f7ba7824e7381cdeb12d1239fa25baec66afa1e10eccff2924f91ac541ebc87e23448a5f6c9b3430c03badc3ab3f4a265976864f87417c7aa0c1025cd2b4f4f2a6c1add8d2807f531a14289b2a0c22e9dae85611ce12188a2fa0a50552f2d9cd74f520b7d594f96475d58be32db42cfd59677aabfc3f9830e2c1a769a7730ecd2aee1394d20ea11929c5cddf9a2b359a0a44efb64b16adb15fe88768d26f11bd24a72fdc45be860ac087c28eb0775ec1d0ef41a732ffa62b66da44d9911029c7a39a054f1cc3f2b35d476719bb8d51abfb8aa2751b8059b9192bdf963ce65167bf3eaa26e61e3fe250ee0eba2f4629441c18af720067cb025e40ade46da2504dc510ee6923685c60b8ac2bb1f19f3d4d783f400e613286f6f59ec275be9a3ec78ffa662551aa24a8e60e7498175f4bb7b7c4d915bc5cbb057fbeb02848c3dcd8c2fa5a2e1cfb6f0a10eb108be37d2654284359e98b9a6847e72bb71d89099751be50520c8c7e4df1c6ab0341257e32fedcc3c51daa84bf8192e887c9971ac68a8b334', 'admin', 'cad4a5c509cee6df7df9ca80b98acf73', '2022-12-23 16:31:17', NULL, '2023-01-15 15:33:32', NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;


SELECT * FROM SYSLA02 a
JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID like '%kitech.com.sms.xda.ComSmsSS01%' GROUP BY sID) b
ON a.sID = b.sID AND a.nRevision = b.max_revision
;

-- proworks request parameter

select *
from sysla03 a
JOIN (SELECT sID, MAX(nRevision) AS max_revision FROM SYSLA02 WHERE sID like '%kitech.com.sms.xda.ComSmsSS01%' GROUP BY sID) b
ON a.sID = b.sID AND a.nRevision = b.max_revision

select *
from sysla03
where sID = 'kitech.com.sms.xda.ComSmsSS01'
and nRevision = '10';

-- proworks responce parameter
select *
from SYSLA04
where sID = 'kitech.com.sms.xda.ComSmsSS01'
and nRevision = '10';