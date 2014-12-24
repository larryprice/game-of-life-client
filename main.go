package main

import "net/http"

func main() {
    http.Handle("/", http.FileServer(http.Dir("views")))
    http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
    http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/"))))
    http.ListenAndServe(":5000", nil)
}