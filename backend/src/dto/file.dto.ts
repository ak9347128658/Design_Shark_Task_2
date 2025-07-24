import { IsString, IsBoolean, IsOptional, IsMongoId, IsArray, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFolderDto {
  @IsString()
  name!: string;

  @IsMongoId()
  @IsOptional()
  parent?: string;
}

export class CreateFileDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsInt()
  @Min(0)
  size!: number;

  @IsMongoId()
  @IsOptional()
  parent?: string;
}

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId()
  @IsOptional()
  parent?: string;
}

export class ShareFileDto {
  @IsArray()
  @IsMongoId({ each: true })
  userIds!: string[];
}

export class FileQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsMongoId()
  @IsOptional()
  parent?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isFolder?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  shared?: boolean;
}
