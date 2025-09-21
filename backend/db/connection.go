package db



import (
"fmt"
"log"
"os"
"time"


"github.com/joho/godotenv"
"gorm.io/driver/mysql"
"gorm.io/gorm"
"gorm.io/gorm/logger"
)


var DB *gorm.DB


func Connect() {
_ = godotenv.Load()


user := os.Getenv("DB_USER")
pass := os.Getenv("DB_PASS")
host := os.Getenv("DB_HOST")
port := os.Getenv("DB_PORT")
name := os.Getenv("DB_NAME")


if user == "" {
user = "root"
}
if host == "" {
host = "127.0.0.1"
}
if port == "" {
port = "3306"
}
if name == "" {
name = "elearn_db"
}


dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
user, pass, host, port, name)


var err error
DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
Logger: logger.Default.LogMode(logger.Warn),
})
if err != nil {
log.Fatal("❌ DB connect error:", err)
}

sqlDB, _ := DB.DB()
sqlDB.SetMaxOpenConns(20)
sqlDB.SetMaxIdleConns(10)
sqlDB.SetConnMaxLifetime(1 * time.Hour)
}