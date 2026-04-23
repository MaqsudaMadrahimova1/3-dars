import { DataTypes, Optional } from "sequelize";
import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Auth } from "../../auth/entities/auth.entity"; // Adjust the path as necessary

interface AuthAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    otp: string;
}

type AuthAttributesTypes = Optional<AuthAttributes, 'id'>;

@Table
export class Article extends Model<AuthAttributes, AuthAttributesTypes> {
    
 @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
 })
 declare id: number;
 @Column({
    type: DataTypes.STRING,
    allowNull: false,
 })
   title: string;
    @Column({
        type: DataTypes.STRING,
        allowNull: false,
 } )
 content: string;

 @ForeignKey(() => Auth)
 @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
 })
 userid!: number;
 @BelongsTo(() => Auth)
 user_id!: Auth;
}


