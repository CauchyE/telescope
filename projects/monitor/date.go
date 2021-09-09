package main

import (
	"fmt"
	"strconv"
)

type Date struct {
	Year  uint
	Month uint
	Day   uint
}

func NewDate(
	year string,
	month string,
	day string,
) (*Date, error) {
	year2, err := strconv.Atoi(year)
	if err != nil {
		return nil, err
	}
	month2, err := strconv.Atoi(month)
	if err != nil {
		return nil, err
	}
	day2, err := strconv.Atoi(day)
	if err != nil {
		return nil, err
	}
	return &Date{Year: uint(year2), Month: uint(month2), Day: uint(day2)}, nil
}

func (d *Date) Format() string {
	return fmt.Sprintf("%04d-%02d-%02d", d.Year, d.Month, d.Day)
}
