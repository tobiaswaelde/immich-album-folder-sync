export type AssetExifInfo = {
	city?: string;
	country?: string;
	dateTimeOriginal?: string;
	description?: string;
	exifImageHeight?: number;
	exifImageWidth?: number;
	exposureTime?: string;
	fNumber?: number;
	fileSizeInByte?: number;
	focalLength?: number;
	iso?: number;
	latitude?: number;
	lensModel?: string;
	longitude?: number;
	make?: string;
	model?: string;
	modifyDate?: string;
	orientation?: string;
	projectionTime?: string;
	rating?: number;
	state?: string;
	timeZone?: string;
};

export type AvatarColor =
	| 'primary'
	| 'pink'
	| 'red'
	| 'yellow'
	| 'blue'
	| 'green'
	| 'purple'
	| 'orange'
	| 'gray'
	| 'amber';
export type AssetOwner = {
	avatarColor: AvatarColor;
	email: string;
	id: string;
	name: string;
	profileChangedAt: string;
	profileImagePath: string;
};

export type Asset = {
	checksum: string;
	deviceAssetId: string;
	deviceId: string;
	duplicateId?: string;
	duration: string;
	exifInfo?: AssetExifInfo;
	fileCreatedAt: string;
	fileModifedAt: string;
	hasMetadata: boolean;
	id: string;
	isArchived: boolean;
	isFavorite: boolean;
	isOffline: boolean;
	isTrashed: boolean;
	libraryId?: string;
	livePhotoVideoId?: string;
	localDateTime: string;
	originalFileName: string;
	originalMimeType?: string;
	originalPath: string;
	owner?: AssetOwner;
	ownerId: string;
	people?: any;
	resized?: boolean;
};
