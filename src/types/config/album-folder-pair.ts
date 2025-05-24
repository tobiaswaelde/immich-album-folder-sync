import { z } from 'zod';

// export class AlbumFolderPairDto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^(?!.*\/$).*/, { message: 'Path must not have a trailing slash' })
//   path: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @IsUUID('4')
//   albumId: string;

//   @ApiPropertyOptional()
//   @IsBoolean()
//   @IsOptional()
//   recursive: boolean = true;
// }

export const AlbumFolderPair = z.object({
  path: z
    .string()
    .nonempty()
    .regex(/^(?!.*\/$).*/, { message: 'Path must not have a trailing slash' }),
  albumId: z.string().nonempty().uuid(),
  recursive: z.boolean().optional().default(true),
});

export type AlbumFolderPair = z.infer<typeof AlbumFolderPair>;
