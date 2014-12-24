package main

import "net/http"

func main() {
    http.Handle("/", http.FileServer(http.Dir("views")))
    http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/"))))
    http.ListenAndServe(":5000", nil)
}