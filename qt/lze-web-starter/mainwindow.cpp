#include "mainwindow.h"
#include <QMessageBox>
#include "main_win.h"
#include"QStackedWidget"
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
     resize(800, 600);
    QStackedWidget* center_containor = new QStackedWidget(this);
    main_win *main_widget =new main_win(this,center_containor);
    setCentralWidget(center_containor);// 让它占满 MainWindow 的中央区域
    center_containor->addWidget(main_widget);
}
MainWindow::~MainWindow()
{
}
