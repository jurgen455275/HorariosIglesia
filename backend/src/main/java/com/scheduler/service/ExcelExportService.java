package com.scheduler.service;

import com.scheduler.domain.Turno;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportService {

    public ByteArrayInputStream exportarTurnos(List<Turno> turnos) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Horario");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Día", "Fecha", "Miembro 1 (Principal)", "Miembro 2", "Respaldo"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (Turno t : turnos) {
                Row row = sheet.createRow(rowIdx++);
                
                String diaStr = t.getFecha().getDayOfWeek().getValue() == 2 ? "Martes" : "Domingo";
                row.createCell(0).setCellValue(diaStr);
                row.createCell(1).setCellValue(t.getFecha().toString());
                
                String m1Text = t.getMiembro1() != null ? t.getMiembro1().getNombre() + (t.getAnotacionM1() != null && !t.getAnotacionM1().isEmpty() ? " " + t.getAnotacionM1() : "") : "VACÍO";
                String m2Text = t.getMiembro2() != null ? t.getMiembro2().getNombre() + (t.getAnotacionM2() != null && !t.getAnotacionM2().isEmpty() ? " " + t.getAnotacionM2() : "") : "VACÍO";
                
                row.createCell(2).setCellValue(m1Text);
                row.createCell(3).setCellValue(m2Text);
                row.createCell(4).setCellValue(t.getRespaldo() != null ? t.getRespaldo().getNombre() : "VACÍO");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al exportar Excel", e);
        }
    }
}
