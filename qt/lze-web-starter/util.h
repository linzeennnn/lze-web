#ifndef UTIL_H
#define UTIL_H
#include <QString>
#include<QJsonObject>
QString get_work_dir();
QString concat_path(const QString& baseDir, const QString& subPath);
QString read_text(const QString &filePath);
bool write_text(const QString& filePath, const QString& content);
QString pretty_json(const QString &jsonStr);
QString obj_to_json(QJsonObject json_obj);
QJsonObject json_to_obj(QString json_str);
QString gen_token();
void remove_action_user(QJsonObject &control_config,QString control,QString action,QString remove_name);
void add_action_user(QJsonObject &control_config,QString control,QString action,QString new_name);
void new_user_default_action(QJsonObject &control_config,QString username);
class util
{
public:
    util();
};

#endif // UTIL_H
