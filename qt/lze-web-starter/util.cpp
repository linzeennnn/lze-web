#include "util.h"
#include <QCoreApplication>
#include <QFile>
#include <QString>
#include <QTextStream>
#include <QJsonArray>
#include <QDir>
#include <QJsonObject>
#include <QJsonDocument>
#include <QDebug>
#include <QDateTime>
#include <QRandomGenerator>
//获取运行目录
QString get_work_dir(){
    return QCoreApplication::applicationDirPath();
}
//拼接路径
QString concat_path(const QString& baseDir, const QString& subPath) {
    QDir dir(baseDir);
    return dir.filePath(subPath);
}
//读取文本
QString read_text(const QString &filePath) {
    QFile file(filePath);
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
        return "";

    QTextStream in(&file);
    QString content = in.readAll();
    file.close();
    return content;
}
//文本写入
bool write_text(const QString& filePath, const QString& content) {
    QFile file(filePath);

    // 自动创建父目录
    QDir dir;
    QString parentDir = QFileInfo(filePath).absolutePath();
    if (!dir.exists(parentDir)) {
        if (!dir.mkpath(parentDir)) {
            qWarning("无法创建目录: %s", qPrintable(parentDir));
            return false;
        }
    }

    // 打开文件，如果不存在则创建
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        qWarning("无法打开文件: %s", qPrintable(filePath));
        return false;
    }

    QTextStream out(&file);
    out << content;
    file.close();
    return true;
}
//美化json
QString pretty_json(const QString &jsonStr) {
    QJsonParseError error;
    QJsonDocument doc = QJsonDocument::fromJson(jsonStr.toUtf8(), &error);
    if (error.error != QJsonParseError::NoError) {
        return QString("JSON 解析错误：%1").arg(error.errorString());
    }
    return doc.toJson(QJsonDocument::Indented);
}
//json转object
QJsonObject json_to_obj(QString json_str){
    QJsonParseError parseError;
    QJsonDocument doc = QJsonDocument::fromJson(json_str.toUtf8(), &parseError);
    return doc.object();
}
//object转json
QString obj_to_json(QJsonObject json_obj){
 QJsonDocument doc(json_obj);
    QString json_str= doc.toJson(QJsonDocument::Compact);
 return pretty_json(json_str);
}
//生成token
QString gen_token(){
    const QString charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    QString randomStr;

    for (int i = 0; i < 32; ++i) {
        int index = QRandomGenerator::global()->bounded(charset.length());
        randomStr.append(charset[index]);
    }

    // 当前时间戳（精确到小时）= 总秒数 / 3600
    qint64 timestamp = QDateTime::currentSecsSinceEpoch() / 3600;

    return randomStr + "_" + QString::number(timestamp);
}
//添加权限用户
void add_action_user(QJsonObject &control_config,QString control,QString action,QString new_name){
    QJsonObject control_obj=control_config[control].toObject();
    QJsonObject action_part=control_obj["action"].toObject();
    QJsonObject action_obj=action_part[action].toObject();
    QJsonArray user_list=action_obj["user"].toArray();
    for (int i = 0; i < user_list.size(); ++i) {
        const QJsonValue &val = user_list[i];
        if (val.isString() && new_name == val.toString()) {
            return;
        }
    }
    user_list.append(new_name);
    action_obj["user"]=user_list;
    action_part[action]=action_obj;
    control_obj["action"]=action_part;
    control_config[control]=control_obj;
}
//移除权限用户
void remove_action_user(QJsonObject &control_config,QString control,QString action,QString remove_name){
    QJsonObject control_obj=control_config[control].toObject();
    QJsonObject action_part=control_obj["action"].toObject();
    QJsonObject action_obj=action_part[action].toObject();
    QJsonArray user_list=action_obj["user"].toArray();
    QJsonArray new_user_list;
    for (int i = 0; i < user_list.size(); ++i) {
        const QJsonValue &val = user_list[i];
        if (remove_name != val.toString()) {
            new_user_list.append(val.toString());
        }
    }
    action_obj["user"]= new_user_list;
    action_part[action]=action_obj;
    control_obj["action"]=action_part;
    control_config[control]=control_obj;
}
//新用户默认权限
void new_user_default_action(QJsonObject &control_config,QString username){
    add_action_user(control_config,"bok","newbok",username);
    add_action_user(control_config,"doc","downdir",username);
    add_action_user(control_config,"doc","copy",username);
    add_action_user(control_config,"doc","delete",username);
    add_action_user(control_config,"doc","downfile",username);
    add_action_user(control_config,"doc","move",username);
    add_action_user(control_config,"doc","newdir",username);
    add_action_user(control_config,"doc","rename",username);
    add_action_user(control_config,"doc","updir",username);
    add_action_user(control_config,"doc","upfile",username);
    add_action_user(control_config,"not","edit",username);
    add_action_user(control_config,"not","newnote",username);
    add_action_user(control_config,"not","upload",username);
    add_action_user(control_config,"pic","upload",username);
    add_action_user(control_config,"tra","recover",username);
}
